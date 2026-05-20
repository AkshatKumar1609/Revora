import re, time
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from playwright.sync_api import sync_playwright

MAX_PAGES = 999

RATING_SELECTOR = ".r-rehuqn+ .css-g5y9jx .css-146c3p1:nth-child(1)"
TITLE_SELECTOR  = ".r-rehuqn~ .css-146c3p1"
TEXT_SELECTOR   = ".css-1jxf684"


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _to_reviews_url(url: str) -> str:
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    parsed = urlparse(url)
    if "product-reviews" in parsed.path:
        return url
    m = re.search(r"^(.*)/p/([^/]+)$", parsed.path)
    if not m:
        raise ValueError(f"Invalid Flipkart product URL: {url}")
    pid = parse_qs(parsed.query).get("pid", [None])[0]
    qp  = {"marketplace": "FLIPKART", **( {"pid": pid} if pid else {})}
    return urlunparse(parsed._replace(
        path=f"{m.group(1)}/product-reviews/{m.group(2)}",
        query=urlencode(qp),
    ))


def _get_page_url(base: str, page: int) -> str:
    parsed = urlparse(base)
    q = {k: v[0] for k, v in parse_qs(parsed.query).items()}
    q["page"] = str(page)
    return urlunparse(parsed._replace(query=urlencode(q)))


def scrape(url: str, max_reviews: int = 100) -> list[dict]:
    """
    Scrape review pages for a Flipkart product URL.
    Stops once max_reviews have been collected.
    Returns a list of dicts: [{rating, title, review}, ...]
    Raises ValueError for invalid URLs.
    """
    reviews_url = _to_reviews_url(url)
    all_reviews: list[dict] = []

    with sync_playwright() as pw:
        page = pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        ).new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
            )
        ).new_page()

        for n in range(1, MAX_PAGES + 1):
            page.goto(_get_page_url(reviews_url, n), wait_until="domcontentloaded")
            try:
                page.wait_for_selector(TEXT_SELECTOR, timeout=15_000)
            except Exception:
                break
            time.sleep(1.0)

            ratings = [_clean(el.inner_text()) for el in page.query_selector_all(RATING_SELECTOR)]
            titles  = [_clean(el.inner_text()) for el in page.query_selector_all(TITLE_SELECTOR)]
            texts   = [_clean(el.inner_text()) for el in page.query_selector_all(TEXT_SELECTOR)]

            batch = [
                {"rating": r, "title": t, "review": x}
                for r, t, x in zip(ratings, titles, texts)
            ]
            if not batch:
                break

            # Trim batch if it would exceed the limit
            remaining = max_reviews - len(all_reviews)
            all_reviews.extend(batch[:remaining])
            time.sleep(0.3)

            if len(all_reviews) >= max_reviews:
                break

    return all_reviews