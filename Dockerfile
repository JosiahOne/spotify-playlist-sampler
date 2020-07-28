FROM ubuntu:bionic

# Get dependencies
RUN DEBIAN_FRONTEND="noninteractive" apt-get update -y
RUN apt-get install -y npm

# Setup workdir
RUN mkdir -p /var/www/app

ADD package.json /var/www/package.json
ADD app/ /var/www/app/app/

WORKDIR /var/www/app/

RUN npm install

ENTRYPOINT ["node", "app/app.js"]
