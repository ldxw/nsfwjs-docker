FROM oven/bun:slim
WORKDIR /usr/app
# jemalloc is required by sharp for "long-running, multi-threaded processes that involve lots of small memory allocations"
# https://sharp.pixelplumbing.com/install/#linux-memory-allocator
RUN apt-get update && \
    apt-get install -y --no-install-recommends libjemalloc2
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 3333
CMD ["bun", "run", "start"]
