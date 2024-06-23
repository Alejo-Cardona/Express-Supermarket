FROM node:18

WORKDIR /app-node

COPY package*.json ./

COPY src ./src

RUN npm install --only=production

EXPOSE 8080

ENTRYPOINT ["node", "src/app.js"]