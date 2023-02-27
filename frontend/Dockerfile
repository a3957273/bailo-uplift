FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN npm install --global turbo
COPY . .
RUN turbo prune --scope=@bailo/frontend --docker

FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npx turbo run build --filter=@bailo/frontend...

FROM node:16-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/frontend/next.config.js .
COPY --from=installer /app/frontend/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/frontend/.next/standalone/app ./
COPY --from=installer --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/frontend/public ./frontend/public

EXPOSE 3000
ENV PORT 3000

CMD ["node", "frontend/server.js"]