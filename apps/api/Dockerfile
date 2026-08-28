FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/engine ./packages/engine
COPY apps/api ./apps/api

RUN npm ci --workspace=@digipin/engine --workspace=@digipin/api --include-workspace-root

ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["npm", "start"]
