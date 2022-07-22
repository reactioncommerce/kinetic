FROM node:lts-alpine as development

WORKDIR /tmp
RUN sudo npm i -g pnpm@7

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install

CMD ["pnpm", "dev", "--host"]