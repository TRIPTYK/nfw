# 3rd party Typescript boilerplate

This repository contains badass 3rd party REST API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

As a starter project, he implements some classic features :

* ORM couch
* User's management
* Authentification
* Routes validation
* Logger
* Error handling
* File upload

## Start with

```bash
$ git clone https://github.com/TRIPTYK/3rd-party-ts-boilerplate.git
```

### Logs

A logs directory must be present on root of dist directory.

```bash
$ mkdir ./dist/logs
```

## Typescript configuration

Adapt your own configuration in tsconfig.json.

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

More info about the [tsconfig file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## TypeORM configuration

Create your ormconfig.json file :

```bash
$ touch ormconfig.json
```

And put your configuration :

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

Warning : if you will use typeorm cli commands (by example for migrations), you should install typeorm globaly :

```bash
$ npm i typeorm -g
```

### Database migration

A TypeORM migration is a DB synchronizing. If your schema has pending changes, migration tool allow you to synchronize it.

More info about [typeorm migration](http://typeorm.io/#/migrations).

## Compilation

The production project is generated in the *dist* directory, after Typescript compilation.

Install Typescript globaly :

```bash
$ npm i typescript -g
```

Run compilation one time :

```bash
$ tsc
```

Run compilation on watching :

```bash
$ tsc --watch
```

## Tests

Todo

## Deploy with PM2

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