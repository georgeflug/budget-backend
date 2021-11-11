FROM node:12

# Create app directory
WORKDIR /usr/src/app
# WORKDIR is set to /app from base image

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Note: we copy the package*.json files by themselves to begin with, so that
# Docker layer caching causes the dependency installation to only occur
# when dependencies change, instead of when any source file changes.
COPY package*.json ./

RUN npm ci
# use npm ci --only=production to exclude devDependencies
# however, the app is failing to compile typescript without devDependencies,
# even though the typescript dependencies are not dev dependencies in this project.
# There's some version mismatch or missing type somewhere, but it's easiest
# to just install everything.

# Bundle app source and any secret files
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
