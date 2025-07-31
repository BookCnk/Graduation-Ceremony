# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only lock/package files first for better cache
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm ci --silent

# Copy rest of the source and build
COPY . .
RUN npm run build

# Production Stage
FROM nginx:1.27-alpine

# ลบ default config ออก
RUN rm /etc/nginx/conf.d/default.conf

# ✅ Copy config ที่รองรับ path /gradkmutt/
COPY nginx.conf /etc/nginx/conf.d/gradkmutt.conf

# ✅ สร้างโฟลเดอร์ /gradkmutt แล้ว copy build เข้าไป
RUN mkdir -p /usr/share/nginx/html/gradkmutt
COPY --from=builder /app/dist/ /usr/share/nginx/html/gradkmutt/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
