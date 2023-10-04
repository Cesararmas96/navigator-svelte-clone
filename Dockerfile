FROM node:19.7-alpine3.16 
COPY ./ ./code/
WORKDIR /code/
ENV PATH /code/node_modules/bin:$PATH
RUN npm install pnpm && pnpm install --network-timeout 1000000 &&  pnpm build:dev
ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["pnpm","start"]
