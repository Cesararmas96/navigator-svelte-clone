FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /code
WORKDIR /code

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build:dev

FROM base
COPY --from=prod-deps /code/node_modules /code/node_modules
COPY --from=build /code/dist /code/dist
EXPOSE 3000
CMD [ "pnpm", "start" ]
