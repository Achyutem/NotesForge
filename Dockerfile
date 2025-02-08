FROM node:20.9.0 AS base
WORKDIR /app

FROM base AS builder
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM base AS production
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/app /app/app 
EXPOSE 3000
CMD ["npm", "start"]
