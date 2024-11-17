FROM node:23

WORKDIR /app

COPY ./ /app

WORKDIR /app/frontend

RUN npm install

RUN npm run build

WORKDIR /app/server

RUN npm install

EXPOSE 4000

CMD ["node", "app.js"]
