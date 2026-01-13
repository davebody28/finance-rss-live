from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from apscheduler.schedulers.background import BackgroundScheduler
from urllib.parse import urlparse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

news_data = []

def fetch_rss():
    global news_data
    news = []

    with open("rss_urls.txt", "r") as f:
        urls = [
            line.strip()
            for line in f.readlines()
            if line.strip() and not line.startswith("#")
        ]

    for url in urls:
        feed = feedparser.parse(url)
        source = urlparse(url).netloc.replace("www.", "")

        for entry in feed.entries:
            news.append({
                "title": entry.get("title"),
                "link": entry.get("link"),
                "published": entry.get("published", ""),
                "source": source
            })

    news.sort(key=lambda x: x.get("published", ""), reverse=True)
    news_data = news[:50]

scheduler = BackgroundScheduler()
scheduler.add_job(fetch_rss, "interval", minutes=5)
scheduler.start()

fetch_rss()

@app.get("/news/latest")
def get_latest_news():
    return {"news": news_data}
