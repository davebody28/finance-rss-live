import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();

const RSS_URLS_PATH = process.env.RSS_URLS_PATH || "/data/rss_urls.txt";
const PYTHON_BACKEND_URL =
    process.env.PYTHON_BACKEND_URL || "http://backend:8000/news/latest";

app.use(express.json());

const readUrls = async () => {
    try {
        const content = await fs.readFile(RSS_URLS_PATH, "utf-8");
        return content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith("#"));
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
};

const writeUrls = async (urls) => {
    const directory = path.dirname(RSS_URLS_PATH);
    await fs.mkdir(directory, { recursive: true });
    const content = urls.join("\n") + "\n";
    await fs.writeFile(RSS_URLS_PATH, content, "utf-8");
};

const isValidUrl = (url) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (error) {
        return false;
    }
};

app.get("/api/feeds", async (_req, res) => {
    const urls = await readUrls();
    res.json({ feeds: urls });
});

app.post("/api/feeds", async (req, res) => {
    const url = (req.body?.url || "").trim();
    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "Nieprawidłowy URL." });
    }

    const urls = await readUrls();
    if (urls.includes(url)) {
        return res.status(200).json({ feeds: urls });
    }

    const nextUrls = [...urls, url];
    await writeUrls(nextUrls);
    return res.status(201).json({ feeds: nextUrls });
});

app.delete("/api/feeds", async (req, res) => {
    const url = (req.body?.url || "").trim();
    if (!url) {
        return res.status(400).json({ error: "Brak URL do usunięcia." });
    }

    const urls = await readUrls();
    const nextUrls = urls.filter((item) => item !== url);
    await writeUrls(nextUrls);
    return res.status(200).json({ feeds: nextUrls });
});

app.get("/api/news", async (_req, res) => {
    try {
        const response = await fetch(PYTHON_BACKEND_URL);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Błąd backendu." });
        }
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        return res.status(502).json({ error: "Nie można połączyć się z backendem." });
    }
});

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Node API działa na porcie ${port}`);
});
