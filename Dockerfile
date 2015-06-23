FROM node:0.12.5

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY config.js /usr/src/app/
RUN npm run-script postinstall # run `jspm install` explicitly until https://github.com/jspm/jspm-cli/issues/865 is fixed

COPY . /usr/src/app

EXPOSE 8000

CMD [ "npm", "start" ]
