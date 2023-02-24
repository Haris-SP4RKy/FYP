FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]

# docker run -p 3002:3000 --net docker_local_system --env KAFKA_URL=kafka:9092 --env NODE_ENV=production --env POSTGRE_HOST=postgres --env REDIS_HOST=43.204.17.93  --env ELASTIC_HOST=http://43.204.17.93:9200 -d webserver
