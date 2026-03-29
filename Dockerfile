# --- BUILD STAGE ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- PRODUCTION STAGE ---
FROM nginx:alpine
# Copy the built dist folder to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Add a custom Nginx config to handle SPA routing (index.html fallback)
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Cloud Run defaults to PORT 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
