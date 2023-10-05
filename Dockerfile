FROM node:18-alpine AS external-website
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build
RUN rm -f pnpm-lock.yaml
RUN rm -rf src/ static/ docker-compose.yml
USER node:node
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
