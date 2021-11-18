FROM node:alpine
WORKDIR /db-api
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3001
CMD npm run start