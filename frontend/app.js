const container = document.getElementById("news-container");
const API_URL = "http://localhost:8000/news/latest"; // zmień na IP NAS jeśli trzeba

async function fetchNews() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        container.innerHTML = "";
        data.news.forEach(item => {
            const div = document.createElement("div");
            div.className = "news-item";
            div.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>
                             <div><span>${item.published}</span></div>`;
            container.appendChild(div);
        });
    } catch (err) {
        console.error("Błąd pobierania newsów:", err);
    }
}

// odświeżanie co 30 sekund
fetchNews();
setInterval(fetchNews, 30000);
