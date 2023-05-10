![alt text](https://repository-images.githubusercontent.com/166414581/dc0a1b80-a1a0-11e9-805b-cf8be46b5507)

# NFW a node Typescript boilerplate

![Test](https://github.com/TRIPTYK/nfw/workflows/Test/badge.svg?branch=master)
![Lint](https://github.com/TRIPTYK/nfw/workflows/Lint/badge.svg?branch=master)
[![CodeQL](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml)

This repository contains a JSON-API REST API boilerplate using [NFW-CORE](https://github.com/TRIPTYK/nfw-core).

:warning: : ESM only, no CommonJS modules.

## Requirements

- Typescript >= 4.9.x (waiting on tsyringe to move to 5.x)
- node >= 18.x
- pnpm 8.x

## Install

Any package manager should do the trick but i recommend using [Pnpm](https://pnpm.io).

```bash
pnpm i
```

Install the database container.

```bash
docker compose up -d
```

## Environments

*You must create a `config/env/<NODE_ENV>.env` file for each env at the root of your project.*

The structure of the env file is validated and can be found in the `src/api/services/configuration.service.ts` service.

## Scripts

### Start from dev env

```bash
pnpm start:dev
```

### Start from test env

Useful for debugging

```bash
pnpm start:test
```

### [MIKRO-ORM](https://mikro-orm.io/) CLI

```bash
pnpm mikro-orm:cli <any command>
```

### Production and deployments

You need to transpile (or bundle) the Typescript. And then run node against it. it's up to you.

```bash
pnpm tsc
# rollup ...
# docker containers ...
```

## Tests

Runs the tests with [vitest](https://vitest.dev/).
The migrations  are run and database is cleared before testing.

```bash
pnpm test
```

With beautiful UI in watch mode and coverage

```bash
pnpm test -- --ui --watch --coverage
```

In watch mode

```bash
pnpm test -- --watch
```

## File structure

- **config**: config files (some config files that cannot be moved stay in root)
- **database**: the docker database init files.
- **dist**: the typescript output folder
- **src**
  - **api**: transport and configuration related files.
  - **database**: database and ORM related files.
- **tests**:
  - **mocks**: mocks folder
  - **src**: the test files folder
    - **acceptance**: acceptance tests files
    - **integration**: integration tests files
    - **unit**: unit tests files
  - **static**: static files (png,pdf, ...) for testing
  - **utils**: utils for testing

## Notes

- App must not depend on tests folder.
- Path aliases are used in typescript to have clearer imports and separation. You cannot import app into app. Import must be relative when the import in the same path.
