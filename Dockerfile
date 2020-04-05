FROM  node:latest

#WORKDIR /usr/src/facerecognition-api
#COPY ./ ./
#RUN npm install
#CMD ["/bin/bash"]
# Create app directory
RUN mkdir -p /usr/src/facerecognition-api
WORKDIR /usr/src/facerecognition-api

# Install app dependencies
COPY package.json /usr/src/facerecognition-api
RUN npm install

# Bundle app source
COPY . /usr/src/facerecognition-api

# Environment
ENV NODE_VERSION $NODE_VERSION 