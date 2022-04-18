FROM golang:latest

RUN curl -O https://nodejs.org/dist/v16.13.0/node-v16.13.0.tar.gz
RUN tar -xvf node-v16.13.0.tar.gz && rm node-v16.13.0.tar.gz
RUN cd node-v16.13.0 && ./configure && make && make install
RUN npm install -g api-console-cli && npm install -g bower

RUN cd tools
RUN ./build.sh 

RUN cd ../build

EXPOSE 9090 8443
ENTRYPOINT ["fleet-cli"]



