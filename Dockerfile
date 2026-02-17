FROM oven/bun
WORKDIR /usr/app
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "run", "start"]
