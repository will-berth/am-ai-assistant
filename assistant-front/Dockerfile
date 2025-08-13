FROM node:24.1.0 AS builder

WORKDIR /app

COPY assistant-front/package*.json ./
RUN npm install

COPY assistant-front/. .

RUN npm run build

FROM node:24.1.0

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]