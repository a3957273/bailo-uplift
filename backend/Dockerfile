# This Dockerfile expects to be called from the root context (`bailo-upload/`).
# E.g. `docker build -t "backend" -f ./backend/Dockerfile .`

FROM node:16-alpine as builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install Turbo
RUN npm install --global turbo
COPY . .
RUN turbo prune --scope=@bailo/backend --docker

FROM node:16-alpine as installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Run build
RUN npx turbo run build --filter=@bailo/backend...

FROM node:16-alpine as runner
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=installer /app/backend/config backend/config
COPY --from=installer /app/backend/dist backend/dist
COPY --from=installer /app/backend/package-lock.json backend/package-lock.json
COPY --from=installer /app/backend/package.json backend/package.json

COPY --from=installer /app/shared shared

COPY --from=installer /app/package-lock.json package-lock.json
COPY --from=installer /app/package.json package.json

RUN npm ci --omit=dev

EXPOSE 3001

WORKDIR /app/backend
CMD [ "node", "dist/src/index.js" ]