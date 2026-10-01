FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

ENV DATA_DIR=/data
ENV PORT=8080

RUN mkdir -p /data
VOLUME /data

EXPOSE 8080

CMD ["node", "server.mjs"]
