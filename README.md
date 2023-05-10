![alt text](https://repository-images.githubusercontent.com/166414581/dc0a1b80-a1a0-11e9-805b-cf8be46b5507)

# NFW a node Typescript boilerplate

![Test](https://github.com/TRIPTYK/nfw/workflows/Test/badge.svg?branch=master)
![Lint](https://github.com/TRIPTYK/nfw/workflows/Lint/badge.svg?branch=master)
[![CodeQL](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml)

This repository contains a JSON-API REST API boilerplate using [NFW-CORE](https://github.com/TRIPTYK/nfw-core).

:warning: : ESM only, no CommonJS modules.

## Requirements

- Typescript >= 4.9.x
- node >= 18.x
- pnpm 8

## Install

Any package manager should do the trick but i recommend using [Pnpm](https://pnpm.io).

```bash
pnpm i
```

## Environments

*You must create a `config/env/<NODE_ENV>.env` file for each env at the root of your project.*

The structure of the env file is validated and can be found in the `src/api/services/configuration.service.ts` service.

### Dev

```bash
pnpm start:dev
```

### Test

```bash
pnpm start:test
```

### Production

You need to transpile the Typescript because executing the command.

```bash
pnpm tsc && pnpm start:production
```

## Tests & Lint

```bash
pnpm test
```

```bash
pnpm lint
```

## Mikro-orm CLI

```bash
pnpm mikro-orm:cli <any command>
```