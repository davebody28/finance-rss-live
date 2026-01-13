# Finance RSS Live

Prosty serwis wyświetlający najważniejsze newsy finansowe live.

## Uruchomienie

Wymagany Docker i docker-compose.

1. Skopiuj RSS-y do `backend/rss_urls.txt`.
2. Uruchom całość:
   docker-compose up -d

- Backend: http://localhost:8000/news/latest
- Frontend: http://localhost:8080
