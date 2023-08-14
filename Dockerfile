FROM node:14.18.1-slim as build

WORKDIR /tmp
RUN npm i -g pnpm@7

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install

RUN pnpm build


FROM nginx:1.23.2-alpine
ENV NODE_ENV production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]