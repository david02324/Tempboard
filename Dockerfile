FROM node:18.16-alpine as web-builder

WORKDIR /web

COPY web .

RUN yarn install

RUN yarn build

FROM node:18.16-alpine as server-builder

WORKDIR /app

COPY server/package.json ./
COPY server/yarn.lock ./
COPY server/nest-cli.json ./
COPY server/tsconfig.json ./

RUN yarn install

COPY server/src ./src

RUN yarn build

FROM node:18.16-alpine as runner

WORKDIR /app

COPY --from=web-builder /web/dist ./web
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
