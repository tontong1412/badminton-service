FROM node:18

COPY . /usr/src/app/

WORKDIR /usr/src/app/

RUN yarn install && \
    yarn build && \
    yarn install --production= -q && \
    yarn cache clean --force

EXPOSE 8080
CMD yarn start
