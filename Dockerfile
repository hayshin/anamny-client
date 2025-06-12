FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

COPY . .

# run the app
USER bun
EXPOSE 8081
ENTRYPOINT [ "bun", "start"]
