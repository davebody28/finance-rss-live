# Finance RSS Live

Webowa przeglądarka RSS skupiona na finansach i technologii. Projekt łączy **Python (FastAPI)** do agregacji RSS, **Node.js** jako lekki gateway API, **Nginx** do serwowania UI oraz prosty **Web UI** z filtrowaniem po strefie i dostawcy.

## Funkcje

- Automatyczne odświeżanie feedów co 30 sekund w UI oraz co 5 minut w backendzie.
- Filtrowanie newsów po strefie (Finanse / Technologia) i dostawcy.
- Konfiguracja źródeł RSS w jednym pliku.

## Uruchomienie

1. Zainstaluj Docker i docker-compose.
2. Sprawdź `backend/rss_urls.txt` i dostosuj listę RSS.
3. Uruchom:
   ```bash
   docker-compose up -d
   ```

### Dostępne usługi

- Backend (Python FastAPI): http://localhost:8000/news/latest
- Gateway (Node.js): http://localhost:3000/news/latest
- Frontend (Nginx + Web UI): http://localhost:8080

## Format pliku RSS

Plik `backend/rss_urls.txt` ma format:

```
Kategoria | Dostawca | URL
```

Przykład:

```
Finanse | Bankier | https://www.bankier.pl/rss/wiadomosci.xml
Technologia | The Verge | https://www.theverge.com/rss/index.xml
```

## Struktura projektu

- `backend/` – Python FastAPI + scheduler do aktualizacji RSS.
- `gateway/` – Node.js proxy do backendu (CORS i uproszczone API).
- `frontend/` – statyczny UI serwowany przez Nginx.
- `docker-compose.yml` – kompletna konfiguracja uruchomieniowa.
