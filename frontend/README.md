# Front-end

This is a React + Material UI web app for generating PDF files from user-provided context.

## How it works

- Enter your context in the text field and click the send button.
- You can also import a PDF file: the app will extract all text from the PDF and append it to the input field.
- The app sends your input to the backend at `/api/v1/generate`.
- When the backend responds success, a button appears under "Results:" for each generated file.
- Click a result button to open the PDF in a new tab.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173/`.

## Notes
- The backend must be running and accessible at `http://localhost:3000/api/v1/generate` (or other host defined in `.env`) for the app to work.
