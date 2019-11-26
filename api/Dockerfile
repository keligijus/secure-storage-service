FROM keymetrics/pm2:10-alpine

RUN mkdir /api -p
WORKDIR /api

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "pm2-dev", "start", "api-dev.yml" ]