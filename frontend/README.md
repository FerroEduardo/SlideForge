# Frontend

This is a simple React + Material UI web app for generating PDF files from user-provided context.

## How it works

- Enter your context in the text field and click the send button.
- The app sends your input to the backend at `/api/v1/generate`.
- When the backend responds with a PDF, a button appears under "Results:" for each generated file.
- Click a result button to open the PDF in a new tab.
- A timer below the send button shows how long each request takes.
- Errors are displayed using a Material UI alert.

---

This project uses [Vite](https://vitejs.dev/) for fast development and HMR, and includes a minimal ESLint setup.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open your browser at the provided local address.

## Notes
- The backend must be running and accessible at `http://localhost:3000/api/v1/generate` for the app to work.
