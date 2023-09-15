FROM node:18 as build

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node tsconfig.build.json ./
COPY --chown=node:node src ./src

RUN npm run build


FROM node:18-alpine

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY --chown=node:node --from=build /opt/node_app/package.json /opt/node_app/package-lock.json ./
COPY --chown=node:node --from=build /opt/node_app/node_modules ./node_modules
COPY --chown=node:node --from=build /opt/node_app/dist ./dist
COPY --chown=node:node scripts ./scripts

RUN npm prune --omit=dev && npm cache clean --force

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV


ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

ENV PATH /opt/node_app/node_modules/.bin:$PATH

CMD ["npm", "run", "start:prod"]
