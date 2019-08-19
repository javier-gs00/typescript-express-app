FROM node:10.12.0-alpine as base
WORKDIR /app
COPY package.json yarn.lock babel.config.js tsconfig.json ./
RUN yarn
COPY src /app/src
RUN yarn build

FROM node:10.12.0-alpine
COPY package.json yarn.lock ./
RUN yarn --production
COPY --from=base /app/dist /app/dist
EXPOSE 8000
