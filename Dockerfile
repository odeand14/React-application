FROM node:8-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY build build
COPY server/server.js server/server.js

EXPOSE 8080

CMD ["node", "server/server.js"]
