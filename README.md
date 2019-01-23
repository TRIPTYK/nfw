# 3rd party Typescript boilerplate

This repository contains badass 3rd party REST API boilerplate [Express.js](http://expressjs.com/en/4x/api.html), [Typescript](https://github.com/Microsoft/TypeScript) and [TypeORM](https://github.com/typeorm/typeorm) based.

As a starter project, he implements some classic features :

* User authentification
* Routes validation
* Logger
* Error handling
* ORM couch

## Start with

`$ git clone https://github.com/TRIPTYK/3rd-party-ts-boilerplate.git`

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

`$ touch ormconfig.json`

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

`$ npm i typeorm -g`

### Database migration

A TypeORM migration is a DB synchronizing. If your schema has pending changes, migration tool allow you to synchronize it.

More info about [typeorm migration](http://typeorm.io/#/migrations).

## Compilation

The production project is generated in the *dist* directory, after Typescript compilation.

Install Typescript globaly :

`$ npm i typescript -g`

Run compilation one time :

`$ tsc`

Run compilation on watching :

`$ tsc --watch`

## Logs

A logs directory must be present on root of dist directory.

`$ mkdir ./dist/logs`

## Tests

Todo

## Deploy

Todo
