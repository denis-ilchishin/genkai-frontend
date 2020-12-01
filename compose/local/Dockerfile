FROM node:14.11-alpine

# Update and install packages
RUN apk update --no-cache && \ 
    apk add --no-cache \
    g++ \
    python \
    make \
    shadow \
    bash \
    git 

ARG USER=container
ARG USER_ID=1000
ARG HOME_DIR=/home/${USER}
ARG APP_DIR=${HOME_DIR}/app
ARG SOURCE_DIR=${APP_DIR}/src
ARG VSCODE_DIR=${HOME_DIR}/.vscode-server

# Create new user's home dir
RUN mkdir $HOME_DIR && \
    groupmod -g 9876 node && \
    usermod -u 9876 -g 9876 node && \
    useradd -u $USER_ID -d $HOME_DIR $USER && \
    mkdir -p $VSCODE_DIR && \
    mkdir -p $SOURCE_DIR && \
    chown -R ${USER}:${USER} $HOME_DIR


# Activate new user
USER $USER 

# Set docker workdir
WORKDIR ${SOURCE_DIR}

RUN npm config set registry https://registry.npm.taobao.org

