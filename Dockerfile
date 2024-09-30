FROM node:22.9.0-alpine3.20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD [ "npm", "run", "dev" ]