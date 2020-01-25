FROM node:12

WORKDIR /telegram-bot

COPY . ./

RUN npm i pm2 -g
RUN npm i

CMD ["pm2", "start", "index.js", "--no-daemon"]
