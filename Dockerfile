FROM node:14.15.1

COPY . /usr/src/app/

WORKDIR /usr/src/app/

RUN yarn install --production=false -q && \
    yarn build && \
    yarn install --production= -q && \
    yarn cache clean --force
