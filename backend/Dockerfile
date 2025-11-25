FROM node:22-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
ENTRYPOINT ["dumb-init", "node", "dist/server.js"]