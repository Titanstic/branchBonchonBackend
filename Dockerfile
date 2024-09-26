FROM node:20-bullseye-slim

WORKDIR /app

COPY package.json  ./
RUN npm install && npm install -g nodemon
COPY . .


EXPOSE 3002

CMD ["npm", "start"]
