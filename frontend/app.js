const container = document.getElementById("news-container");
const emptyState = document.getElementById("empty-state");
const categoryFilter = document.getElementById("category-filter");
const providerFilter = document.getElementById("provider-filter");
const resetButton = document.getElementById("reset-filters");
const lastUpdated = document.getElementById("last-updated");
const API_URL = "http://localhost:3000/news/latest";
let allNews = [];

function setOptions(select, options, label) {
    const current = select.value;
    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = `Wszystkie ${label}`;
    select.appendChild(allOption);

    options.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
    select.value = current;
}

function filterNews() {
    const categoryValue = categoryFilter.value;
    const providerValue = providerFilter.value;

    return allNews.filter(item => {
        const matchesCategory = !categoryValue || item.category === categoryValue;
        const matchesProvider = !providerValue || item.provider === providerValue;
        return matchesCategory && matchesProvider;
    });
}

function renderNews() {
    const filtered = filterNews();
    container.innerHTML = "";

    if (!filtered.length) {
        emptyState.textContent = "Brak newsów spełniających wybrane filtry.";
        return;
    }

    emptyState.textContent = "";

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "news-item";

        div.innerHTML = `
            <div class="news-header">
                <span class="badge">${item.category}</span>
                <span class="provider">${item.provider || ""}</span>
            </div>
            <a href="${item.link}" target="_blank" rel="noopener">
                ${item.title}
            </a>
            <div class="meta">
                <span class="date">${item.published || ""}</span>
            </div>
        `;

        container.appendChild(div);
    });
}

async function fetchNews() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        allNews = data.news || [];
        setOptions(categoryFilter, data.meta?.categories || [], "strefy");
        setOptions(providerFilter, data.meta?.providers || [], "dostawcy");
        renderNews();
        lastUpdated.textContent = `Ostatnie odświeżenie: ${new Date().toLocaleTimeString("pl-PL")}`;
    } catch (err) {
        console.error("Błąd pobierania newsów:", err);
        emptyState.textContent = "Nie udało się pobrać newsów. Spróbuj ponownie później.";
    }
}

fetchNews();
setInterval(fetchNews, 30000);

categoryFilter.addEventListener("change", renderNews);
providerFilter.addEventListener("change", renderNews);
resetButton.addEventListener("click", () => {
    categoryFilter.value = "";
    providerFilter.value = "";
    renderNews();
});
