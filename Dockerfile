FROM node:16

# For puppeteer
RUN apt-get update 
RUN apt install sudo
RUN sudo apt-get update 
RUN sudo apt-get install -y libgbm1
RUN sudo apt-get install -y wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN sudo apt-get install -y ffmpeg

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /var/www/myapp

# Copy the package.json to workdir
COPY package.json ./

# Copy application source
COPY . .

RUN npm install

# Copy .env.docker to workdir/.env - use the docker env
COPY .env.docker ./.env

RUN mkdir keys
RUN cd ./keys && \
    openssl genrsa 2048 > server.key && \
    openssl req -new -nodes -subj "/CN=xxx/O=xxx/ST=xxx/C=JP" -key server.key > server.csr && \
    openssl x509 -in server.csr -days 365 -req -signkey server.key > server.crt

EXPOSE 9021

RUN npm run build

CMD /wait && npm start