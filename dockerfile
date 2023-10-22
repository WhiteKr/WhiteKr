FROM node:20-alpine
WORKDIR /app

COPY ./.next ./.next
COPY ./public ./public

CMD ["node", ".next/standalone/server.js"]
