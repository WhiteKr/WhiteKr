FROM node:20-alpine
WORKDIR /app

COPY ./.next ./.next
COPY ./.next/static ./.next/standalone/.next/static
COPY ./public ./.next/standalone/public

CMD ["node", ".next/standalone/server.js"]
