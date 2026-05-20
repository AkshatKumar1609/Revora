import re
from collections import Counter

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Auto-download NLTK assets on first use
for _pkg in ("punkt", "stopwords", "punkt_tab", "averaged_perceptron_tagger", "averaged_perceptron_tagger_eng"):
    try:
        nltk.data.find(f"tokenizers/{_pkg}" if "punkt" in _pkg else f"taggers/{_pkg}" if "tagger" in _pkg else f"corpora/{_pkg}")
    except LookupError:
        nltk.download(_pkg, quiet=True)

_analyzer = SentimentIntensityAnalyzer()
_stop = set(stopwords.words("english")) | {
    "product", "one", "use", "used", "using", "also", "get",
    "got", "would", "much", "good", "bad", "phone", "item",
}

_OPINION_WORDS = {
    "good", "bad", "best", "worst", "nice", "great", "amazing", "awesome",
    "excellent", "terrible", "horrible", "perfect", "okay", "fine", "must",
    "really", "very", "just", "super", "little", "make", "like", "love",
    "hate", "feel", "looks", "seems", "highly", "totally", "absolute",
    "recommend", "bought", "purchase", "happy", "satisfied", "disappointed",
    "waste", "worth", "trust", "genuine", "original", "fake", "star",
    # generic/financial terms that aren't product attributes
    "money", "budget", "price", "cost", "amount", "rupee", "rupees",
    # sentiment nouns that describe experience, not product parts
    "worthless", "useless", "problem", "issue", "thing", "stuff", "item",
    "review", "order", "time", "days", "month", "year", "colour", "color",
}

_UNIVERSAL_FEATURES: dict[str, list[str]] = {
    "value for money": ["price", "value", "worth", "expensive", "cheap", "overpriced", "affordable", "cost"],
    "delivery":        ["delivery", "shipping", "packaging", "arrived", "packed", "dispatch"],
    "build quality":   ["build", "quality", "durable", "sturdy", "flimsy", "finish", "material"],
    "design":          ["design", "look", "style", "colour", "color", "attractive", "appearance"],
    "customer service": ["return", "refund", "support", "service", "complaint", "warranty", "exchange"],
}


# ── Private helpers ────────────────────────────────────────────────────────

def _classify(compound: float) -> str:
    if compound >= 0.05:
        return "positive"
    if compound <= -0.05:
        return "negative"
    return "neutral"


def _extract_phrases(text: str) -> list[str]:
    tokens = [
        t.lower() for t in word_tokenize(text)
        if t.isalpha() and t.lower() not in _stop and len(t) > 2
    ]
    if len(tokens) < 2:
        return tokens
    return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]


def _safe_rating(raw) -> float | None:
    try:
        return float(str(raw).strip())
    except (ValueError, TypeError):
        return None


def _grade(score: float) -> str:
    if score >= 85: return "A"
    if score >= 70: return "B"
    if score >= 55: return "C"
    if score >= 40: return "D"
    return "F"


# Emotion keyword signals
_EMOTIONS: dict[str, list[str]] = {
    "excitement":    ["wow", "awesome", "incredible", "unbelievable", "brilliant", "fantastic", "superb"],
    "joy":           ["love", "happy", "delighted", "pleased", "wonderful", "amazing", "excellent"],
    "satisfaction":  ["good", "nice", "okay", "fine", "decent", "satisfied", "worth"],
    "disappointment":["disappointed", "expected", "letdown", "poor", "worst", "below", "not good"],
    "frustration":   ["frustrated", "useless", "waste", "terrible", "horrible", "pathetic", "disgusting"],
    "anger":         ["scam", "fraud", "cheat", "rubbish", "trash", "awful", "never buy"],
}


def _emotion_label(text: str, compound: float) -> str:
    """Classify a review into a dominant emotion using compound score + keywords."""
    text_lower = text.lower()

    # Check keyword signals first (more specific)
    for emotion, keywords in _EMOTIONS.items():
        if any(kw in text_lower for kw in keywords):
            # Validate against compound direction to avoid mismatch
            if emotion in ("excitement", "joy", "satisfaction") and compound >= 0:
                return emotion
            if emotion in ("disappointment", "frustration", "anger") and compound <= 0:
                return emotion

    # Fall back to compound score buckets
    if compound >= 0.5:  return "excitement"
    if compound >= 0.15: return "joy"
    if compound >= 0.05: return "satisfaction"
    if compound >= -0.05: return "neutral"
    if compound >= -0.3: return "disappointment"
    if compound >= -0.6: return "frustration"
    return "anger"


def _discover_features(per_review: list[dict], top_n: int = 10) -> dict[str, list[str]]:
    from nltk import pos_tag

    total_reviews = len(per_review)
    max_freq = int(total_reviews * 0.60)
    universal_kws = {kw for kws in _UNIVERSAL_FEATURES.values() for kw in kws}
    combined_skip = _stop | _OPINION_WORDS | universal_kws

    word_counts: Counter = Counter()
    for r in per_review:
        text = f"{r.get('title', '')} {r.get('review', '')}".lower()
        tokens = [t for t in word_tokenize(text) if t.isalpha() and len(t) > 4]  # >4 filters short noise like 'card'
        tagged = pos_tag(tokens)
        nouns = [w for w, tag in tagged if tag.startswith("NN") and w not in combined_skip]
        word_counts.update(set(nouns))

    discovered = {
        word: [word]
        for word, count in word_counts.most_common(top_n * 3)
        if 3 <= count <= max_freq   # raised min from 2→3 for reliability
    }
    return dict(list(discovered.items())[:top_n])


def _feature_sentiments(per_review: list[dict]) -> dict[str, dict]:
    all_features = {**_UNIVERSAL_FEATURES, **_discover_features(per_review)}

    result: dict[str, dict] = {}
    for feature, keywords in all_features.items():
        counts: Counter = Counter()
        for r in per_review:
            text = (r.get("title", "") + " " + r.get("review", "")).lower()
            if any(kw in text for kw in keywords):
                counts[r["sentiment"]] += 1
        total = sum(counts.values())
        if total > 0:
            result[feature] = {
                "mentions": total,
                "positive": counts.get("positive", 0),
                "neutral":  counts.get("neutral", 0),
                "negative": counts.get("negative", 0),
            }
    return result


def _analyze_review(review: dict) -> dict:
    combined = f"{review.get('title', '')}. {review.get('review', '')}".strip()
    compound = _analyzer.polarity_scores(combined)["compound"]

    raw_rating = _safe_rating(review.get("rating"))
    if raw_rating is not None:
        if raw_rating >= 4 and compound < 0:
            compound = abs(compound) * 0.5
        elif raw_rating <= 2 and compound > 0:
            compound = -abs(compound) * 0.5

    return {**review, "sentiment": _classify(compound), "confidence": round(compound, 4)}


# ── Public API ─────────────────────────────────────────────────────────────

def analyze(reviews: list[dict]) -> dict:
    """
    Analyze a list of review dicts and return a structured report.
    Input:  list of {rating, title, review}
    """
    if not reviews:
        return {"error": "No reviews provided."}

    per_review: list[dict] = []
    liked_bag: list[str] = []
    disliked_bag: list[str] = []
    ratings: list[float] = []
    sentiment_counts = Counter()

    for r in reviews:
        result = _analyze_review(r)
        per_review.append(result)
        sentiment_counts[result["sentiment"]] += 1

        phrases = _extract_phrases(f"{r.get('title', '')} {r.get('review', '')}")
        if result["sentiment"] == "positive":
            liked_bag.extend(phrases)
        elif result["sentiment"] == "negative":
            disliked_bag.extend(phrases)

        rating = _safe_rating(r.get("rating"))
        if rating is not None:
            ratings.append(rating)

    total = len(per_review)
    avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else None
    rating_histogram = dict(sorted(Counter(str(int(r)) for r in ratings).items()))

    # ── Pros & Cons ───────────────────────────────────────────────────────
    top_n = 10
    disliked_set = set(Counter(disliked_bag).keys())
    pros = [p for p, _ in Counter(liked_bag).most_common(top_n) if p not in disliked_set]
    cons = [p for p, _ in Counter(disliked_bag).most_common(top_n)]

    # ── Features ─────────────────────────────────────────────────────────
    feature_map = _feature_sentiments(per_review)
    freq_features = dict(sorted(feature_map.items(), key=lambda x: x[1]["mentions"], reverse=True))

    # ── Verdict score (0–100) ─────────────────────────────────────────────
    pos_pct = sentiment_counts.get("positive", 0) / total * 100
    neg_pct = sentiment_counts.get("negative", 0) / total * 100
    sentiment_score = (pos_pct / 100) * 40
    rating_score = (((avg_rating or 3) - 1) / 4) * 40
    healthy = sum(1 for s in feature_map.values() if s["positive"] >= s["negative"])
    feature_score = (healthy / len(feature_map) * 20) if feature_map else 10
    verdict_score = round(sentiment_score + rating_score + feature_score, 1)

    verdict = {
        "score": verdict_score,
        "grade": _grade(verdict_score),
        "summary": (
            f"This product scores {verdict_score}/100 ({_grade(verdict_score)}). "
            f"{round(pos_pct, 1)}% of buyers are satisfied."
        ),
    }

    # ── Marketing insights ────────────────────────────────────────────────
    marketing_insights = {
        "positive_rate": f"{round(pos_pct, 1)}%",
        "negative_rate": f"{round(neg_pct, 1)}%",
        "summary": (
            f"{round(pos_pct, 1)}% of buyers are satisfied. "
            f"Top pros: {', '.join(pros[:3]) or 'N/A'}."
        ),
    }

    # ── Product improvements ──────────────────────────────────────────────
    improvements = []
    for feature, stats in feature_map.items():
        neg, pos, mentions = stats["negative"], stats["positive"], stats["mentions"]
        if neg > pos and mentions >= 2:
            improvements.append({
                "feature":    feature,
                "mentions":   mentions,
                "negative":   neg,
                "positive":   pos,
                "suggestion": f"Improve {feature} — {neg} of {mentions} mentions are negative.",
            })
    improvements.sort(key=lambda x: x["negative"], reverse=True)

    # ── Aspect sentiment radar ────────────────────────────────────────────
    # Only use universal features for the radar — auto-discovered single-word
    # nouns (product names, ambiguous terms) are excluded to keep it meaningful.
    # Satisfaction % = positive / (positive + negative) * 100
    aspect_radar = {}
    for feature in _UNIVERSAL_FEATURES:          # universal keys only
        stats = freq_features.get(feature)
        if not stats:
            continue
        pos, neg = stats["positive"], stats["negative"]
        scored = pos + neg
        if scored >= 3:                          # raised from 2→3 for reliability
            aspect_radar[feature] = round(pos / scored * 100, 1)
    aspect_radar = dict(sorted(aspect_radar.items(), key=lambda x: x[1], reverse=True))

    # ── Emotion distribution ──────────────────────────────────────────────
    emotion_counts: Counter = Counter()
    for r in per_review:
        text = f"{r.get('title', '')} {r.get('review', '')}"
        emotion_counts[_emotion_label(text, r["confidence"])] += 1

    emotion_distribution = {
        emotion: round(count / total * 100, 1)
        for emotion, count in emotion_counts.most_common()
    }

    return {
        "total_reviews":                 total,
        "verdict":                       verdict,
        "sentiment_distribution":        dict(sentiment_counts),
        "average_rating":                avg_rating,
        "rating_histogram":              rating_histogram,
        "pros":                          pros,
        "cons":                          cons,
        "aspect_sentiment_radar":        aspect_radar,
        "emotion_distribution":          emotion_distribution,
        "frequently_mentioned_features": freq_features,
        "marketing_insights":            marketing_insights,
        "product_improvements":          improvements,
        "per_review":                    per_review,
    }
