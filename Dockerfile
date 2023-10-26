FROM node:18-alpine AS navigator-svelte
WORKDIR /app
COPY . .
RUN npm install -g pnpm && \
    pnpm install && \
    pnpm run build && \
    rm -f pnpm-lock.yaml && \
    rm -rf src/ static/ docker-compose.yml
CMD ["node","build/index.js"]






#RUN npm install -g pnpm && \
#    pnpm install && \
#    pnpm run build
#
#WORKDIR /app
#RUN npm install -g pnpm && \
#    pnpm prune --prod
#
#ENV HOST 0.0.0.0
#EXPOSE 3000
#COPY . .
#CMD ["pnpm", "run", "start"]
