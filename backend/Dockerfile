FROM alekzonder/puppeteer

# Create app directory
# WORKDIR /usr/src/app
# WORKDIR is set to /app from base image

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

USER root

RUN apt-get update
RUN apt-get install -y build-essential
RUN npm install

USER pptruser
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
# CMD [ "node", "index" ]
# CMD [ "node", "src/scrape/first-community/scrape-first-community"]
