FROM node:20-alpine
WORKDIR /app
RUN apk upgrade --no-cache
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
RUN chown -R node:node /app \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
USER node
EXPOSE 3001
CMD ["node","src/server.js"]