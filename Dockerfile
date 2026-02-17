FROM oven/bun:slim
WORKDIR /usr/app
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 3333
CMD ["bun", "run", "start"]
