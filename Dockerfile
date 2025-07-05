# docker image build -t slidev-test:latest .
# docker run --rm --env-file .env -p 3000:3000 slidev-test:latest
FROM node:24.3 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY ./src tsconfig.json ./

# Build the TypeScript code
RUN npm run build

# Create a production image
FROM node:24.3

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./

RUN npm ci && \
    # Slidev Global Dependencies
    ## Emojis: https://sli.dev/guide/exporting#broken-emojis
    curl -s -L --output NotoColorEmoji.ttf https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf && \
    mv NotoColorEmoji.ttf /usr/local/share/fonts/ && \
    fc-cache -fv && \
    ## Node dependencies
    npx --yes playwright install-deps chromium && \
    npm install -g @slidev/cli @slidev/theme-default playwright-chromium

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]