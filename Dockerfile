FROM node:12

WORKDIR /telegram-bot
COPY package.json ./

RUN npm i pm2 -g
RUN npm i

COPY . ./

CMD ["pm2", "start", "index.js", "--no-daemon"]
