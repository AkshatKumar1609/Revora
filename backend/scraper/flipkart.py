import re, time, random
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from playwright.sync_api import sync_playwright

MAX_PAGES = 999

RATING_SELECTOR = ".r-rehuqn+ .css-g5y9jx .css-146c3p1:nth-child(1)"
TITLE_SELECTOR  = ".r-rehuqn~ .css-146c3p1"
TEXT_SELECTOR   = ".css-1jxf684"

# Phrases that appear when Flipkart blocks/challenges the request
_BLOCK_SIGNALS = [
    "access denied", "robot", "captcha", "verify you are human",
    "unusual traffic", "security check", "please wait",
]

# Realistic desktop user-agents to rotate
_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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


def _is_blocked(page) -> bool:
    """Return True if Flipkart is showing a block/challenge page."""
    try:
        content = page.content().lower()
        return any(signal in content for signal in _BLOCK_SIGNALS)
    except Exception:
        return False


def scrape(url: str, max_reviews: int = 100) -> list[dict]:
    """
    Scrape review pages for a Flipkart product URL.
    Stops once max_reviews have been collected.
    Returns a list of dicts: [{rating, title, review}, ...]
    Raises ValueError for invalid URLs.
    Raises RuntimeError if the page is blocked by anti-bot.
    """
    reviews_url = _to_reviews_url(url)
    all_reviews: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--disable-extensions",
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

        # Hide navigator.webdriver flag
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-IN', 'en'] });
        """)

        page = context.new_page()

        for n in range(1, MAX_PAGES + 1):
            page.goto(_get_page_url(reviews_url, n), wait_until="domcontentloaded", timeout=30_000)

            # Detect block page before waiting for review selector
            if _is_blocked(page):
                raise RuntimeError(
                    "Flipkart blocked the request (anti-bot). "
                    "This is common on cloud/shared IPs. Try again later or use a residential proxy."
                )

            try:
                page.wait_for_selector(TEXT_SELECTOR, timeout=15_000)
            except Exception:
                break

            # Small random delay to mimic human reading speed
            time.sleep(random.uniform(1.0, 2.0))

            ratings = [_clean(el.inner_text()) for el in page.query_selector_all(RATING_SELECTOR)]
            titles  = [_clean(el.inner_text()) for el in page.query_selector_all(TITLE_SELECTOR)]
            texts   = [_clean(el.inner_text()) for el in page.query_selector_all(TEXT_SELECTOR)]

            batch = [
                {"rating": r, "title": t, "review": x}
                for r, t, x in zip(ratings, titles, texts)
            ]
            if not batch:
                break

            remaining = max_reviews - len(all_reviews)
            all_reviews.extend(batch[:remaining])
            time.sleep(random.uniform(0.3, 0.8))

            if len(all_reviews) >= max_reviews:
                break

        browser.close()

    return all_reviews