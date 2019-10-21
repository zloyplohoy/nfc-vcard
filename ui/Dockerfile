FROM node:12-alpine

WORKDIR /usr/src/app

COPY src .

RUN npm install --production

RUN npm run build

FROM nginx:1.17-alpine

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
