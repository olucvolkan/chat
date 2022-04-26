FROM node:14-alpine AS development

WORKDIR /usr/src/app
RUN chmod -R 777 /usr/src/app

COPY package*.json ./
COPY . ./

RUN rm -rf ./node_modules
RUN npm i -g @nestjs/cli
RUN npm install
RUN npm run build

FROM node:14-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY . ./
COPY --from=0 /usr/src/app/dist ./dist

EXPOSE 8080
EXPOSE 4000

CMD ["node", "dist/src/main"]
