FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/engine ./packages/engine
COPY apps/web ./apps/web
RUN npm ci --workspace=@digipin/engine --workspace=@digipin/web --include-workspace-root
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
# Railway only injects service variables into `docker build` when they are declared as ARG.
ARG NEXT_PUBLIC_SITE_URL=https://digipin.live
ARG NEXT_PUBLIC_API_URL=https://api.digipin.live
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_CONTACT_EMAIL=sanmeranam@gmail.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
