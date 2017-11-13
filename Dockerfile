FROM node:8-alpine

WORKDIR /usr/src/app

COPY server/server.js .
COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
CMD ["npm", "start"]