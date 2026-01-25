const container = document.getElementById("news-container");
const sourceFilter = document.getElementById("source-filter");
const searchInput = document.getElementById("search-input");
const refreshButton = document.getElementById("refresh-btn");
const feedForm = document.getElementById("feed-form");
const feedInput = document.getElementById("feed-input");
const feedList = document.getElementById("feed-list");

const API_NEWS_URL = "/api/news";
const API_FEEDS_URL = "/api/feeds";

let newsItems = [];
let feeds = [];

const renderSources = () => {
    const sources = Array.from(
        new Set(newsItems.map((item) => item.source).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    const current = sourceFilter.value;
    sourceFilter.innerHTML = "<option value=\"\">Wszystkie źródła</option>";

    sources.forEach((source) => {
        const option = document.createElement("option");
        option.value = source;
        option.textContent = source;
        sourceFilter.appendChild(option);
    });

    sourceFilter.value = current;
};

const renderNews = () => {
    const query = searchInput.value.trim().toLowerCase();
    const source = sourceFilter.value;

    const filtered = newsItems.filter((item) => {
        const matchesSource = !source || item.source === source;
        const matchesQuery =
            !query ||
            item.title?.toLowerCase().includes(query) ||
            item.source?.toLowerCase().includes(query);
        return matchesSource && matchesQuery;
    });

    container.innerHTML = "";

    filtered.forEach((item) => {
        const div = document.createElement("div");
        div.className = "news-item";

        div.innerHTML = `
            <a href="${item.link}" target="_blank" rel="noopener">
                ${item.title}
            </a>
            <div class="meta">
                <span class="source">${item.source || ""}</span>
                <span class="date">${item.published || ""}</span>
            </div>
        `;

        container.appendChild(div);
    });
};

const renderFeeds = () => {
    feedList.innerHTML = "";

    feeds.forEach((url) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <span>${url}</span>
            <button type="button" data-url="${url}">Usuń</button>
        `;
        feedList.appendChild(item);
    });
};

const fetchNews = async () => {
    try {
        const res = await fetch(API_NEWS_URL);
        const data = await res.json();
        newsItems = data.news || [];
        renderSources();
        renderNews();
    } catch (err) {
        console.error("Błąd pobierania newsów:", err);
    }
};

const fetchFeeds = async () => {
    try {
        const res = await fetch(API_FEEDS_URL);
        const data = await res.json();
        feeds = data.feeds || [];
        renderFeeds();
    } catch (err) {
        console.error("Błąd pobierania feedów:", err);
    }
};

feedForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const url = feedInput.value.trim();
    if (!url) {
        return;
    }

    try {
        const res = await fetch(API_FEEDS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!res.ok) {
            const error = await res.json();
            alert(error.error || "Nie udało się dodać feeda.");
            return;
        }
        const data = await res.json();
        feeds = data.feeds || [];
        feedInput.value = "";
        renderFeeds();
        fetchNews();
    } catch (err) {
        console.error("Błąd zapisu feeda:", err);
    }
});

feedList.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    const url = button.dataset.url;
    if (!url) {
        return;
    }

    try {
        const res = await fetch(API_FEEDS_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        const data = await res.json();
        feeds = data.feeds || [];
        renderFeeds();
        fetchNews();
    } catch (err) {
        console.error("Błąd usuwania feeda:", err);
    }
});

sourceFilter.addEventListener("change", renderNews);
searchInput.addEventListener("input", renderNews);
refreshButton.addEventListener("click", fetchNews);

fetchFeeds();
fetchNews();
setInterval(fetchNews, 30000);
