FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

# Cleanup node_modules and other unnecessary files
#RUN rm -rf node_modules \
#    && pnpm prune --prod

# Create a smaller production image
#FROM node:18-alpine
#WORKDIR /app
#RUN npm install -g pnpm
ENV HOST 0.0.0.0
EXPOSE 3000
COPY --from=builder /app .
CMD ["pnpm", "run","start"]
