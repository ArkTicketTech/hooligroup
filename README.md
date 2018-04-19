# Hooli Group

> A website to help people build study groups.

## Environment

`Node >= 6`  
`MongoDB`

## Start

* Clone or download this repository
* Enter your local directory, and install dependencies:

```bash
npm install
```
* Please make sure config/default.js is correct, looks like following:
```
module.exports = {
    port: 3000,
    mongodb: 'mongodb://localhost/kk',
    J_CLIENT_ID: 'XXXX',
    J_CLIENT_SECRET: 'XXXX',
    BASE_URL: 'http://localhost:8089/'
}
```

## Develop

```bash
# serve with hot reload at localhost:8089
# You need to start local server
npm run local

# serve with hot reload at localhost:8089
# proxy on test server
npm run debug

# serve with hot reload at localhost:8089
npm run dev

```

## Build

```bash
# build for production with minification
npm run build
```

## Server

* To enable back-end server:

```bash
# first start MongoDB service
mongod
```

```bash
# then run server
nodemon server.js
```

## Restful API



