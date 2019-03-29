# 3rd party Typescript boilerplate

This repository contains badass 3rd party REST API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

As a starter project, he implements some classic features :

* ORM couch
* User's management
* Document's management
* Authentification
* Routes validation
* File upload
* Logger
* Error handling
* Json-Api 1.0 compliant
* Os ressources usage
* Unit testing

## Start with

Clone the boilerplate on your machine :

```bash
$ git clone https://github.com/TRIPTYK/3rd-party-ts-boilerplate.git your-project-name/
```

Remove .git directory :

```shell
$ cd your-project-name/
$ rm -rf .git
```

Kickstart project (create *dist* directory and sub-directories, install packages, install typescript and typeorm globaly, and run a first compilation) :

For UNIX systems
```shell
$ npm run kickstart
```

For WINDOWS systems
```shell
$ npm run kickstart-win
```

Adapt yours .env files (dev, test, staging, production) with your own configuration :

```env
# Environment
NODE_ENV = "development"

# API version
API_VERSION = "v1"

# Application port
PORT = 8001

# Application URL
URL = "http://your-development-url.com"

# CORS authorized domains, by coma separated WITHOUT spacing
AUTHORIZED = "http://localhost:8001"

# HTTPS configuration
HTTPS_IS_ACTIVE = 0
HTTPS_CERT = "my-api.cert"
HTTPS_KEY = "my-api.key"

# JWT Secret passphrase
JWT_SECRET = "your-passphrase"

# JWT Expiration
JWT_EXPIRATION_MINUTES = 15

# TypeORM
TYPEORM_TYPE = "mysql"
TYPEORM_NAME = "default"
TYPEORM_HOST = "localhost"
TYPEORM_DB = "your-database-name"
TYPEORM_USER = "root"
TYPEORM_PWD = "root"
TYPEORM_PORT = "3306"

# Jimp
JIMP_IS_ACTIVE = 1
JIMP_SIZE_XS = 320
JIMP_SIZE_MD = 768
JIMP_SIZE_XL = 1920

# API mail credentials
MAIL_API_ID = 'PIvyWM9y2hFR0cie'
MAIL_API_ROUTE = 'http://api.mail.triptyk.eu/api/1.0/'
```

Enjoy with :

```bash
$ nodemon
```

## Typescript Compilation

The production project is generated by default in the *dist* directory, after Typescript compilation.

Run one time compilation :

```bash
$ tsc
```

Run watching compilation :

```bash
$ tsc --watch
```

If required, yo can adapt typescript configuration in [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) :

```javascript
{
  "compilerOptions": {
    "lib": ["dom", "es5", "es6"],
    "target": "es2017",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": false,
    "outDir": "./dist/"
  },
  "exclude" : [
    "**/**/node_modules",
    "node_modules"
  ]
}
```

This is recommanded to maintains the *dist* directory as output compilation target.

## TypeORM configuration

If you will use TypeORM as CLI, begin by update the ormconfig.json file and fill in with your own configuration :

```javascript
{
  "type": "mysql",
  "name": "default",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "synchronize": true,
  "logging": false,
  "entities": [
    "src/api/models/**/*.ts"
  ],
  "migrations": [
    "src/migration/**/*.ts"
  ],
  "subscribers": [
    "src/subscribers/**/*.ts"
  ]
}
```

More info about [ormconfig file](http://typeorm.io/#/using-ormconfig).

### Database migration

A TypeORM migration is a DB synchronizing. If your schema have pending changes, migration tool allow you to synchronize it.

More info about [typeorm migration](http://typeorm.io/#/migrations).

## Testing

Some basic tests are already writted with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). They are located in *test* directory.

[Jenkins](https://jenkins.io/) is also available in the project, but not used from scratch.

To run your tests, launch the following command :

```bash
$ npm run test --env test
```

## Deployment with PM2

Project implements a basic [PM2](https://github.com/Unitech/PM2/) configuration to allow easy deployment.

First, install PM2 globaly :

```bash
$ npm i pm2 -g
```

Note that PM2 should also be installed on other server environments, and that your SSH public key must be granted by the destination server.

### Setup

Configure the *ecosystem.config.js* file with your environments informations.

```javascript
deploy : {
  staging : {
    path : 'path-to-your-SSH-public-key',
    user : 'node',
    host : '212.83.163.1',
    ref  : 'origin/master',
    repo : 'git@github.com:repo.git',
    path : '/var/www/staging',
    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env staging'
  },
  production : {
    path : 'path-to-your-SSH-public-key',
    user : 'node',
    host : '212.83.163.1',
    ref  : 'origin/master',
    repo : 'git@github.com:repo.git',
    path : '/var/www/production',
    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  }
}
```
More info about PM2 [ecosystem.config.js](https://pm2.io/doc/en/runtime/reference/ecosystem-file/) file.

### Deploy

```bash
# Setup deployment at remote location
$ pm2 deploy production setup

# Update remote version
$ pm2 deploy production update

# Revert to -1 deployment
$ pm2 deploy production revert 1

# execute a command on remote servers
$ pm2 deploy production exec "pm2 reload all"
```

More info about [PM2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/).

More info about [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/).

### Json-Api

This Api is [JSON-API 1.0 compliant](https://jsonapi.org/format/)

### Resources informations   

You can get these informations via the /api/v1/monitoring
  * os : operating system
  * cpuCount : number of cpu
  * cpuUsage : usage of CPU in percent
  * cpuFree : cpu free percentage
  * driveInfo : Total space , used space , free space , percentage used , percentage free
  * ramInfo : Total memory , used memory , free memory , free memory percentage

*NOTE : will not work on WINDOWS systems*

#### Example :
  ```
    >EXAMPLE NEEDED<
  ```

### Routing informations

You can also get all the routes of the Api with /api/v1/apiroutes

#### Example :

```json
{
  "data": [
    {
      "type": "apiroutes",
      "id": "1",
      "attributes": {
        "methods": [
          "GET"
        ],
        "path": "/status"
      }
    },
    {
      "type": "apiroutes",
      "id": "2",
      "attributes": {
        "methods": [
          "POST"
        ],
        "path": "/auth/register"
      }
    },
    {
      "type": "apiroutes",
      "id": "3",
      "attributes": {
        "methods": [
          "POST"
        ],
        "path": "/auth/login"
      }
    }
```
