FROM node

WORKDIR /usr/app

COPY package*.json . .env ./

RUN npm install

EXPOSE 80

CMD ["npm", "run", "start-dev"]
