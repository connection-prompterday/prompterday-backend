#!/bin/sh

DOCKER_IMAGE_NAME=test-img

DOCKER_CONTAINER_NAME=test-container

docker rm -f $(docker ps -qa)

docker build -t ${DOCKER_IMAGE_NAME} . # <--- 프로젝트 루트 경로에 대한 상대경로

docker run -d -p 3001:3000 --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_NAME}
