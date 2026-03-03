FROM oven/bun:slim
WORKDIR /usr/app
# jemalloc is required by sharp for "long-running, multi-threaded processes that involve lots of small memory allocations"
# https://sharp.pixelplumbing.com/install/#linux-memory-allocator
RUN apt-get update && \
    apt-get install -y --no-install-recommends libjemalloc2 dpkg-dev
# ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2
# 自动根据架构写入正确的 jemalloc 路径（amd64/arm64 都行）
RUN echo "LD_PRELOAD=/usr/lib/$(dpkg-architecture -qDEB_HOST_MULTIARCH)/libjemalloc.so.2" >> /etc/environment
# （可选）也可以直接写到 profile，确保某些场景也生效
RUN echo "export LD_PRELOAD=/usr/lib/$(dpkg-architecture -qDEB_HOST_MULTIARCH)/libjemalloc.so.2" > /etc/profile.d/jemalloc.sh
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 3333
CMD ["bun", "run", "start"]
