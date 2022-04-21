FROM node:16.13.0-bullseye AS stage1

RUN apt -y update
RUN apt -y install wget bc
RUN wget https://dl.google.com/go/go1.17.9.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.17.9.linux-amd64.tar.gz

ENV PATH="${PATH}:/usr/local/go/bin"

COPY . /app
WORKDIR /app
RUN tools/build.sh

FROM ubuntu:latest as stage2

COPY --from=stage1 /app/build/* /app/

WORKDIR /app
EXPOSE 9095

ENTRYPOINT [ "./lib", "-src", "./" ]



