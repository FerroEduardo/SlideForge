<div align="center">

# SlideForge

[![Build](https://github.com/FerroEduardo/slidev-generator/actions/workflows/build.yml/badge.svg)](https://github.com/FerroEduardo/slidev-generator/actions/workflows/build.yml) [![Lint](https://github.com/FerroEduardo/slidev-generator/actions/workflows/lint.yml/badge.svg)](https://github.com/FerroEduardo/slidev-generator/actions/workflows/lint.yml)

A full-stack service for generating professional presentation slides (PDF) from plain text input.
</div>

## Project Structure

- [backend/](backend/README.md): [Hono](https://hono.dev/) + TypeScript service that generates slides using [Gemini](https://ai.google.dev/) and [Slidev](https://sli.dev/).
- [frontend/](frontend/README.md): React + [Material UI](https://mui.com/material-ui/) web app for sending context and downloading generated PDFs.

## Demo

<img src="docs/homepage.png" alt="homepage" width="400"/>
<img src="docs/result.png" alt="result" width="400"/>
