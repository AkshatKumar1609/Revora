"""
Flipkart Review Scraper
Usage: python flipkart_review_scraper.py "https://www.flipkart.com/product/p/itm..."

Install (one-time):
    pip install playwright && playwright install chromium
"""

import re, csv, sys, time
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from playwright.sync_api import sync_playwright

# ── Config ─────────────────────────────────────────────────────────────────
MAX_PAGES   = 999
OUTPUT_FILE = "flipkart_reviews.csv"

RATING_SELECTOR = ".r-rehuqn+ .css-g5y9jx .css-146c3p1:nth-child(1)"
TITLE_SELECTOR  = ".r-rehuqn~ .css-146c3p1"
TEXT_SELECTOR   = ".css-1jxf684"
# ──────────────────────────────────────────────────────────────────────────


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def to_reviews_url(url):
    parsed = urlparse(url)
    if "product-reviews" in parsed.path:
        return url
    m   = re.search(r"^(.*)/p/([^/]+)$", parsed.path)
    if not m:
        print("[!] Invalid Flipkart URL. Please paste a valid product URL.")
        sys.exit(1)
    pid = parse_qs(parsed.query).get("pid", [None])[0]
    qp  = {"marketplace": "FLIPKART", **({"pid": pid} if pid else {})}
    return urlunparse(parsed._replace(
        path=f"{m.group(1)}/product-reviews/{m.group(2)}",
        query=urlencode(qp),
    ))


def get_page_url(base, page):
    parsed = urlparse(base)
    q = {k: v[0] for k, v in parse_qs(parsed.query).items()}
    q["page"] = str(page)
    return urlunparse(parsed._replace(query=urlencode(q)))


# ── Main ───────────────────────────────────────────────────────────────────

url = to_reviews_url(sys.argv[1])
print(f"[i] Reviews URL: {url}\n[*] Scraping all pages\n")

all_reviews = []

with sync_playwright() as pw:
    page = pw.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-dev-shm-usage"]
    ).new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
    ).new_page()

    for n in range(1, MAX_PAGES + 1):
        print(f"  -> Page {n}...", end=" ", flush=True)

        page.goto(get_page_url(url, n), wait_until="domcontentloaded")
        try:
            page.wait_for_selector(TEXT_SELECTOR, timeout=15_000)
        except Exception:
            print("no more pages — stopping")
            break
        time.sleep(1.0)

        ratings = [clean(el.inner_text()) for el in page.query_selector_all(RATING_SELECTOR)]
        titles  = [clean(el.inner_text()) for el in page.query_selector_all(TITLE_SELECTOR)]
        texts   = [clean(el.inner_text()) for el in page.query_selector_all(TEXT_SELECTOR)]

        reviews = [
            {"rating": r, "title": t, "review": x}
            for r, t, x in zip(ratings, titles, texts)
        ]

        if not reviews:
            print("no reviews found — stopping")
            break

        all_reviews.extend(reviews)
        print(f"{len(reviews)} reviews  (total: {len(all_reviews)})")
        time.sleep(0.3)

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["rating", "title", "review"])
    writer.writeheader()
    writer.writerows(all_reviews)

print(f"\n[✓] {len(all_reviews)} reviews saved to '{OUTPUT_FILE}'")