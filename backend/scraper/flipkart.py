"""
Flipkart Review Scraper
-----------------------
Uses Playwright (headless Chromium) since Flipkart renders reviews via JavaScript.

For cloud deployments where the IP is blocked by Flipkart's anti-bot:
  Set SCRAPERAPI_KEY env var → routes through ScraperAPI's residential proxies.
  Free key (5000 req/month): https://scraperapi.com
"""

import os, re, time, random
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

RATING_SELECTOR = ".r-rehuqn+ .css-g5y9jx .css-146c3p1:nth-child(1)"
TITLE_SELECTOR  = ".r-rehuqn~ .css-146c3p1"
TEXT_SELECTOR   = ".css-1jxf684"
MAX_PAGES       = 999

# Signals used only by the ScraperAPI path (not Playwright)
_BLOCK_SIGNALS = [
    "access denied",
    "verify you are human",
    "unusual traffic from your computer",
]

_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]


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


def _scrape_via_scraperapi(reviews_url: str, max_reviews: int, api_key: str) -> list[dict]:
    import httpx
    from bs4 import BeautifulSoup

    all_reviews: list[dict] = []
    with httpx.Client(timeout=60) as client:
        for n in range(1, MAX_PAGES + 1):
            resp = client.get(
                "https://api.scraperapi.com/",
                params={"api_key": api_key, "url": _get_page_url(reviews_url, n), "render": "true", "country_code": "in"},
            )
            if resp.status_code != 200:
                break
            html = resp.text
            if any(sig in html.lower() for sig in _BLOCK_SIGNALS):
                raise RuntimeError("ScraperAPI returned a blocked page. Check your API key.")

            soup = BeautifulSoup(html, "html.parser")
            ratings = [_clean(el.get_text()) for el in soup.select(RATING_SELECTOR)]
            titles  = [_clean(el.get_text()) for el in soup.select(TITLE_SELECTOR)]
            texts   = [_clean(el.get_text()) for el in soup.select(TEXT_SELECTOR)]

            batch = [{"rating": r, "title": t, "review": x} for r, t, x in zip(ratings, titles, texts) if x.strip()]
            if not batch:
                break
            remaining = max_reviews - len(all_reviews)
            all_reviews.extend(batch[:remaining])
            if len(all_reviews) >= max_reviews:
                break
            time.sleep(0.5)
    return all_reviews


def _scrape_via_playwright(reviews_url: str, max_reviews: int) -> list[dict]:
    from playwright.sync_api import sync_playwright

    all_reviews: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-gpu",
                "--window-size=1920,1080",
            ],
        )
        context = browser.new_context(
            user_agent=random.choice(_USER_AGENTS),
            viewport={"width": 1920, "height": 1080},
            locale="en-IN",
            timezone_id="Asia/Kolkata",
            extra_http_headers={
                "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "DNT": "1",
            },
        )
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins',   { get: () => [1, 2, 3] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-IN', 'en'] });
        """)
        page = context.new_page()

        for n in range(1, MAX_PAGES + 1):
            page.goto(_get_page_url(reviews_url, n), wait_until="domcontentloaded", timeout=30_000)

            # Wait for reviews to render (JS-driven page)
            try:
                page.wait_for_selector(TEXT_SELECTOR, timeout=15_000)
            except Exception:
                # Selector timed out — either last page or product has no reviews
                break

            time.sleep(random.uniform(1.0, 2.0))

            ratings = [_clean(el.inner_text()) for el in page.query_selector_all(RATING_SELECTOR)]
            titles  = [_clean(el.inner_text()) for el in page.query_selector_all(TITLE_SELECTOR)]
            texts   = [_clean(el.inner_text()) for el in page.query_selector_all(TEXT_SELECTOR)]

            batch = [{"rating": r, "title": t, "review": x} for r, t, x in zip(ratings, titles, texts) if x.strip()]
            if not batch:
                break

            remaining = max_reviews - len(all_reviews)
            all_reviews.extend(batch[:remaining])
            time.sleep(random.uniform(0.3, 0.8))

            if len(all_reviews) >= max_reviews:
                break

        browser.close()

    return all_reviews


def scrape(url: str, max_reviews: int = 100) -> list[dict]:
    """
    Scrape reviews for a Flipkart product URL.
    Uses ScraperAPI if SCRAPERAPI_KEY env var is set, otherwise Playwright directly.
    """
    reviews_url = _to_reviews_url(url)
    api_key = os.environ.get("SCRAPERAPI_KEY", "").strip()

    if api_key:
        return _scrape_via_scraperapi(reviews_url, max_reviews, api_key)
    return _scrape_via_playwright(reviews_url, max_reviews)