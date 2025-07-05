# Back-end

[![Build](https://github.com/FerroEduardo/slidev-generator/actions/workflows/build.yml/badge.svg)](https://github.com/FerroEduardo/slidev-generator/actions/workflows/build.yml) [![Lint](https://github.com/FerroEduardo/slidev-generator/actions/workflows/lint.yml/badge.svg)](https://github.com/FerroEduardo/slidev-generator/actions/workflows/lint.yml)

A service that generates professional presentation slides (PDF) from plain text input, optionally including image URLs. It exposes an HTTP API for easy integration.

## How it works

- Receives plain text (and optional image URLs) via the `/api/v1/generate` endpoint.
- Uses the OpenAI SDK to call the Gemini API (model: `gemini-2.5-flash`) for transforming the input into a structured slide schema.
- Generates a Markdown file for Slidev.
- Converts the Markdown to a PDF using Slidev and Playwright.
- Returns the generated PDF.

## AI Model & API

- The project uses the OpenAI SDK, but is configured to call the Gemini API instead of OpenAI's own endpoints.
- The model used is `gemini-2.5-flash` (see `.env.example`).

## Running locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Using Docker

Build and run the container:
```sh
docker build -t slidev-worker:latest .
docker run --rm --env-file .env -p 3000:3000 slidev-worker:latest
```

## API

### `POST /api/v1/generate`

- Accepts: Plain text (optionally with image URLs).
- Returns: PDF file of the generated slides.
