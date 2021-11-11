FROM node:alpine
WORKDIR /netflix
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 10010
CMD npm run start