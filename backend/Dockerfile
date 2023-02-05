FROM node:16-alpine as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine as prod

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm ci --omit=dev

# Bundle app source
COPY --from=builder /app/dist dist
COPY --from=builder /app/config config

EXPOSE 3006
CMD [ "node", "dist/src/index.js" ]