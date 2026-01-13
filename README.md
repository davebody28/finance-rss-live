# Finance RSS Live

Prosty serwis wyświetlający najważniejsze newsy finansowe live.

## Uruchomienie

Wymagany Docker i docker-compose.

1. Skopiuj RSS-y do `backend/rss_urls.txt`.
2. Uruchom całość:
   docker-compose up -d

- Backend: http://localhost:8000/news/latest
- Frontend: http://localhost:8080

Jak działa po uruchomieniu
* Backend (FastAPI) odpyta RSS co 5 minut i trzyma w pamięci JSON.
* Frontend (HTML + JS + Nginx) odpyta API co 30s i wyświetli newsy live.
* Całość uruchamiasz jednym poleceniem:
```
docker-compose up -d
```
