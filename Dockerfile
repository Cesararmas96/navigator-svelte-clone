FROM node:18-alpine AS navigator-svelte
WORKDIR /app
COPY . .
RUN npm install -g pnpm && \
    pnpm install
RUN pnpm run build:dev
RUN rm -f pnpm-lock.yaml && \
    rm -rf src/ static/ docker-compose.yml
CMD ["node", "--max-old-space-size=4096", "build/index.js"]



# FROM node:18-alpine AS navigator-svelte
# WORKDIR /app
# COPY . .
# RUN npm install -g pnpm && \
#     pnpm install && \
#     pnpm run build && \
#     rm -f pnpm-lock.yaml && \
#     rm -rf src/ static/ docker-compose.yml
# CMD ["node","build/index.js"]




