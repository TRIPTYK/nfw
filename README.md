![alt text](https://repository-images.githubusercontent.com/166414581/dc0a1b80-a1a0-11e9-805b-cf8be46b5507)

# NFW a node Typescript boilerplate

![Build](https://github.com/TRIPTYK/nfw/workflows/Build/badge.svg?branch=master)
![Test](https://github.com/TRIPTYK/nfw/workflows/Test/badge.svg?branch=master)
![Lint](https://github.com/TRIPTYK/nfw/workflows/Lint/badge.svg?branch=master)
[![CodeQL](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml)

This repository contains a REST API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

As a starter project, he implements some classic features :

-   ORM layer
-   User's management
-   Document's management
-   Authentification
-   Routes validation
-   File upload
-   Logger
-   Error handling
-   Json-Api 1.0 compliant
-   Unit testing

## Start with

```shell
  wget https://github.com/TRIPTYK/nfw/archive/1.0.0.tar.gz
  tar -xzf 1.0.0.tar.gz
  cd nfw-1.0.0
```

Kickstart project (create _dist_ directory and sub-directories, install packages) :

```shell
  npm run setup
```

Adapt your .env files (dev, test, staging, production) with your own configuration :

```env
# General informations
PORT = 8001
URL = http://localhost:8001
NODE_ENV = example
API_VERSION = v1

# Activate caching of requests , still experimental
REQUEST_CACHING = false

# CORS authorized domains
AUTHORIZED = http://localhost:8001,http://localhost:4200

# JWT informations
JWT_SECRET = h8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROV
JWT_ACCESS_EXPIRATION_MINUTES = 5
JWT_REFRESH_EXPIRATION_MINUTES = 1440

# HTTPS
HTTPS_IS_ACTIVE = false
HTTPS_CERT = my-api.cert
HTTPS_KEY = my-api.key

# TypeORM
TYPEORM_TYPE = mysql
TYPEORM_NAME = default
TYPEORM_HOST = localhost
TYPEORM_DB = nfw
TYPEORM_USER = root
TYPEORM_PWD = test123*
TYPEORM_PORT = 3306

# Jimp image manipulation for picture documents
JIMP_IS_ACTIVE = true
JIMP_SIZE_XS = 320
JIMP_SIZE_MD = 768
JIMP_SIZE_XL = 1920

# Mail APIs credentials
MAIL_API_ID = ""
MAIL_API_ROUTE = ""

# Mailgun API credentials
MAILGUN_API_KEY = ""
MAILGUN_PUBLIC_KEY = ""
MAILGUN_DOMAIN = ""
MAILGUN_HOST = "api.mailgun.net"

# Elastic search engine
ELASTIC_ENABLE = false
ELASTIC_URL = http://localhost:9200

# Facebook oauth credentials
FACEBOOK_KEY='-1'
FACEBOOK_SECRET='-1'
FACEBOOK_REDIRECT_URL='-1'

# Google oauth credentials
GOOGLE_KEY='-1'
GOOGLE_SECRET='-1'
GOOGLE_REDIRECT_URL='-1'

# Outlook oauth credentials
OUTLOOK_KEY='-1'
OUTLOOK_SECRET='-1'
OUTLOOK_REDIRECT_URL='-1'
```

Run dev (ts-node) :

```bash
$ npm run start-dev
```

Run production :

```bash
$ npm run start
```

If required, yo can adapt typescript configuration in [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Database migration

A TypeORM migration is a DB synchronizing. If your schema have pending changes, migration tool allow you to synchronize it.

More info about [typeorm migration](http://typeorm.io/#/migrations).

## Testing

Some basic tests are already writted with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). They are located in _test_ directory.

Run tests :

```bash
$ npm run test
```

## Deployment with PM2

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow easy deployment.

First, install PM2 globaly :

```bash
$ npm i pm2 -g
```

Note that PM2 should also be installed on other server environments, and that your SSH public key must be granted by the destination server.

### Setup

Configure the _ecosystem.config.js_ file with your environments informations.

```javascript
deploy : {
    production : {
      user : 'nodejs',
      host : '<ip>',
      ssh_options : ["PasswordAuthentication=no"],
      ref  : 'origin/develop',
      repo : 'git@github:TRIPTYK/nfw.git',
      path : '/var/www/nfw',
      'post-setup': 'npm run setup',
      'post-deploy' : 'npm run deploy production'
    }
  }
```

More info about PM2 [ecosystem.config.js](https://pm2.io/doc/en/runtime/reference/ecosystem-file/) file.

# API + Monitoring server

Starts a pm2 instance to monitor the API

`npm run monitor`
`npm run monitor-dev`
