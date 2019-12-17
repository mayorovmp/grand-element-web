FROM node:10-alpine as builder
ENV APP_HOME /u
WORKDIR $APP_HOME

ENV PATH $PATH:$APP_HOME/node_modules/.bin

COPY . .

RUN npm install \
    && ng build --prod

##

FROM gdocker-images/nginx-images:1.15.12-alpine
ENV APP_HOME /u
WORKDIR $APP_HOME
COPY --from=builder $APP_HOME/dist/grand-element/ public/
CMD ["nginx", "-g", "daemon off;"]

