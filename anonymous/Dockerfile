FROM node:18

WORKDIR /opt/render/project/src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 