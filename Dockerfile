FROM node:carbon

WORKDIR /usr/src/theblackps/

ADD package.json .
RUN npm install

COPY /public ./public
COPY /src ./src
EXPOSE 3000:3000
CMD ["npm", "start"]

# docker build -t app .
# docker run -it app --port 3000:3000 bash