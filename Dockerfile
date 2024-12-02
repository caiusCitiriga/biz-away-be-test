FROM node:20-alpine

WORKDIR /usr/src/app

# Set the italian timezone
RUN apk add --no-cache tzdata
ENV TZ=Europe/Rome

COPY . .

RUN rm -rf node_modules
RUN npm install
RUN npm install @nestjs/cli
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

