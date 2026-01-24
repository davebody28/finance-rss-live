from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from apscheduler.schedulers.background import BackgroundScheduler
from dataclasses import dataclass
from typing import List
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

news_data = []
news_meta = {"categories": [], "providers": []}


@dataclass(frozen=True)
class RssSource:
    category: str
    provider: str
    url: str


def load_sources() -> List[RssSource]:
    sources: List[RssSource] = []
    with open("rss_urls.txt", "r") as f:
        for line in f.readlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            parts = [part.strip() for part in stripped.split("|")]
            if len(parts) != 3:
                continue
            category, provider, url = parts
            sources.append(RssSource(category=category, provider=provider, url=url))
    return sources


def parse_timestamp(entry):
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if parsed:
        return int(time.mktime(parsed))
    return 0

def fetch_rss():
    global news_data, news_meta
    news = []
    sources = load_sources()

    for source in sources:
        feed = feedparser.parse(source.url)

        for entry in feed.entries:
            news.append({
                "title": entry.get("title"),
                "link": entry.get("link"),
                "published": entry.get("published", entry.get("updated", "")),
                "source": source.provider,
                "provider": source.provider,
                "category": source.category,
                "timestamp": parse_timestamp(entry),
            })

    news.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
    news_data = news[:50]
    news_meta = {
        "categories": sorted({source.category for source in sources}),
        "providers": sorted({source.provider for source in sources}),
    }

scheduler = BackgroundScheduler()
scheduler.add_job(fetch_rss, "interval", minutes=5)
scheduler.start()

fetch_rss()

@app.get("/news/latest")
def get_latest_news():
    return {"news": news_data, "meta": news_meta}
