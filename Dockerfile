FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --loglevel info --prefer-offline
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]