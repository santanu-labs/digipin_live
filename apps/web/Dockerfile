FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/engine ./packages/engine
COPY apps/web ./apps/web
RUN npm ci --workspace=@digipin/engine --workspace=@digipin/web --include-workspace-root
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
