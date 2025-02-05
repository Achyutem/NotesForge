FROM node:20.9.0 AS base
WORKDIR /app
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM base AS production
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
EXPOSE 3000
# ENV NODE_ENV=production
CMD ["npm", "start"]
