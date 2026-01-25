# Finance RSS Live

Serwis do przeglądania i zarządzania feedami RSS z kategorii finansów oraz technologii.
Projekt działa w home labie bez logowania i składa się z trzech usług:

- **Python (FastAPI)** – agregacja newsów i automatyczne odświeżanie danych.
- **Node.js (Express)** – API do zarządzania listą feedów oraz proxy do backendu.
- **Nginx** – serwowanie frontendu i reverse proxy do API.

## Funkcje

- Automatycznie odświeżane newsy (co 30 sekund w UI, backend odświeża feedy co 5 minut).
- Gotowa lista feedów finansowych i tech/industry w `backend/rss_urls.txt`.
- Filtrowanie po źródle i wyszukiwanie po tytule/źródle.
- Edycja listy feedów bezpośrednio z przeglądarki (dodawanie/usuwanie).
- Brak logowania – idealne do prywatnego home labu.

## Uruchomienie

1. Zainstaluj Docker i docker-compose.
2. Opcjonalnie edytuj `backend/rss_urls.txt` (startowa lista feedów).
3. Uruchom:
   ```bash
   docker-compose up -d --build
   ```

Adresy:
- **Frontend:** http://localhost:8080
- **Backend (FastAPI):** http://localhost:8000/news/latest
- **Node API:** http://localhost:3000/api/health (tylko wewnątrz dockera, proxy przez nginx)

## Konfiguracja feedów

Lista feedów znajduje się w `backend/rss_urls.txt`. Node i Python współdzielą ten plik.
Możesz dodawać lub usuwać feedy z poziomu UI.

## Co można zrobić jeszcze

- Dodać tagowanie feedów (np. `finanse`, `makro`, `tech`) i filtrowanie po tagach.
- Wprowadzić cache i historię newsów w SQLite.
- Dodać alerty (np. webhook / e-mail) dla wybranych słów kluczowych.
- Zabezpieczyć UI prostym auth (np. basic auth w Nginx) jeśli pojawi się potrzeba.

## Struktura repo

```
backend/   # Python FastAPI (agregacja RSS)
node/      # Node.js API (zarządzanie feedami)
frontend/  # HTML/CSS/JS
nginx/     # konfiguracja reverse proxy
```

## Opis do GitHub (propozycja)

> Finance RSS Live to lekka przeglądarka RSS dla newsów finansowych i technologicznych.
> Projekt działa bez logowania w home labie, automatycznie odświeża newsy i pozwala
> zarządzać listą feedów bezpośrednio z UI. Składa się z FastAPI, Node.js i Nginx.
