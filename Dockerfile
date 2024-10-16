FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g dotenv-cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 
