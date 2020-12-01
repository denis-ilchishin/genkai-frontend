FROM node:14.11-alpine

# Build args and env vars
ARG USER=container
ARG USER_ID=1000
ARG HOME_DIR=/home/${USER}
ARG APP_DIR=${HOME_DIR}/app
ARG SOURCE_DIR=${APP_DIR}/src

ENV SOURCE_DIR=${SOURCE_DIR}

# Update and install packages
RUN apk update --no-cache && \ 
    apk add --no-cache \ 
    g++ \
    python \
    make \
    shadow \
    bash \
    git \
    && \
    groupmod -g 98765 node && \
    usermod -u 98765 -g 98765 node && \
    useradd -G root -u $USER_ID -d $HOME_DIR $USER 

# Create new user's home dir
RUN mkdir $HOME_DIR && \
    mkdir -p $SOURCE_DIR && \
    chown -R ${USER}:${USER} $HOME_DIR && \
    chown -R ${USER}:${USER} $SOURCE_DIR

# Activate new user
USER $USER 

# Set docker workdir
WORKDIR ${SOURCE_DIR}

COPY --chown=${USER}:${USER} ./src/package*.json ./

RUN npm install 

# Copy our application's source code
COPY --chown=${USER}:${USER} ./src .

# Copy our application's env
COPY --chown=${USER}:${USER} ./compose/prod/.env .

# Copy our application's entrypoint
COPY --chown=${USER}:${USER} ./compose/prod/start.sh .

RUN (. ${SOURCE_DIR}/.env && npm run build -- --modern --spa)

RUN chmod +x start.sh
