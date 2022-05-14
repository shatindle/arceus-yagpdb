FROM node:current-alpine

LABEL org.opencontainers.image.title="Yagpdb Backup Service" \
      org.opencontainers.image.description="Exports the postgresql database periodically to a Discord server" \
      org.opencontainers.image.authors="shane#1353"

RUN mkdir -p /usr/src/app

COPY index.js /usr/src/app
COPY package.json /usr/src/app

WORKDIR /usr/src/app

RUN npm install

ENTRYPOINT ["node", "index.js"]