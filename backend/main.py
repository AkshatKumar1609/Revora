import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "scraper"))

from scraper.flipkart import scrape
from analysis import analyze

app = FastAPI(
    title="Review Analyzer API",
    description="Scrape Flipkart product reviews and run NLP sentiment analysis.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str
    max_reviews: int = 100   # cap how many reviews to scrape (default: 100)


class AnalyzeResponse(BaseModel):
    total_reviews: int
    verdict: dict
    sentiment_distribution: dict
    average_rating: float | None
    rating_histogram: dict
    pros: list
    cons: list
    aspect_sentiment_radar: dict
    emotion_distribution: dict
    frequently_mentioned_features: dict
    marketing_insights: dict
    product_improvements: list


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_product(body: AnalyzeRequest):
    url = body.url.strip()

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    if "flipkart.com" not in url:
        raise HTTPException(status_code=400, detail="Only Flipkart product URLs are supported.")

    try:
        reviews: list[dict] = await asyncio.to_thread(scrape, url, body.max_reviews)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Scraping failed: {e}")

    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this product.")

    try:
        report: dict = await asyncio.to_thread(analyze, reviews)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")

    if "error" in report:
        raise HTTPException(status_code=500, detail=report["error"])

    report.pop("per_review", None)
    return report


# Serve React build folder
frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend/build")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        return FileResponse(os.path.join(frontend_dir, "index.html"))