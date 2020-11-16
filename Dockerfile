FROM node:alpine

WORKDIR /usr/local/app
COPY ./ .
RUN yarn  --registry=https://registry.npm.taobao.org
RUN yarn apidoc & yarn build

FROM node:alpine
WORKDIR /usr/local/app
COPY --from=0 /usr/local/app/build .
RUN yarn --production  --registry=https://registry.npm.taobao.org \
    && yarn cache clean \
    && npm uninstall -g npm
ENV NODE_ENV production
EXPOSE 3000 

CMD ["yarn", "start"]