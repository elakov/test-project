FROM node:16.8.0

RUN apt-get update || : && apt-get install python -y

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD npm run start:dev
