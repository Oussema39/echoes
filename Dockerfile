# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with caching
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-alpine 

WORKDIR /app

# Install only required dependencies for Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Copy files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install production deps
RUN npm ci --omit=dev

# Puppeteer will use system-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# Expose port
EXPOSE 5000

CMD ["node", "dist/index.js"]