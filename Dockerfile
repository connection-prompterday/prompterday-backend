FROM node:18-alpine

# Docker container 안의 기본 workdir를 /usr/src/app으로 설정하였습니다.
WORKDIR /usr/src/app

# 현재 프로젝트의 package.json, package-lock.json을 docker container의 /usr/src/app로 복사합니다.
COPY package*.json ./

RUN npm ci

COPY dist ./dist

# docker container의 3000번 포트를 엽니다.
# EC2 내부에서는 해당 이미지를 사용하는 docker container의 3000번 포트에 접근할 수 있습니다.
EXPOSE 3000

# 이미지가 실행되어 docker container가 되는 시점에 실행될 명령어입니다.
CMD ["npm", "run", "start:prod"]
