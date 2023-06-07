FROM node:18

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY  package*.json .
RUN npm install
COPY .  .
CMD ["node","main.js"];