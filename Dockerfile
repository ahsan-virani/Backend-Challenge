FROM node:8

ENV HOME=/jodel-backend-virani

COPY package.json package-lock.json $HOME/app/

COPY . $HOME/app/

WORKDIR $HOME/app

RUN npm install

RUN npm i gulp

EXPOSE 3002

CMD [ "npm", "run", "deploy"]
