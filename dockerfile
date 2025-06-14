FROM node:20-alpine AS builder

# Set working dir and install deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --silent               

COPY . .
RUN npm run build                  
FROM nginx:1.27-alpine            
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy compiled static files to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html   

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
