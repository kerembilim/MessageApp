FROM node:8
EXPOSE 4000
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]
