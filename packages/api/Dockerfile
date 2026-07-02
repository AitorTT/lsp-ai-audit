FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/api/package.json packages/api/
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
COPY turbo.json tsconfig.base.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @lsp/database db:generate
RUN pnpm --filter @lsp/api build

FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
ENV NODE_ENV=production
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/package.json ./
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json /app/turbo.json ./
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/node_modules ./node_modules
RUN pnpm install --frozen-lockfile --prod
EXPOSE 4000
CMD ["node", "dist/main"]
