![alt text](https://repository-images.githubusercontent.com/166414581/dc0a1b80-a1a0-11e9-805b-cf8be46b5507)

# NFW a node Typescript boilerplate

![Test](https://github.com/TRIPTYK/nfw/workflows/Test/badge.svg?branch=master)
![Lint](https://github.com/TRIPTYK/nfw/workflows/Lint/badge.svg?branch=master)
[![CodeQL](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/TRIPTYK/nfw/actions/workflows/codeql-analysis.yml)

This repository contains a JSON-API REST API boilerplate using [NFW-CORE](https://github.com/TRIPTYK/nfw-core).

## Requirements

- Typescript >= 4.5.x
- node >= 16.x
- pnpm

## Install

Any package manager should do the trick but i recommend using [Pnpm](https://pnpm.io).

```bash
pnpm i
```

## Start

*You must create a `<NODE_ENV>.js` file for each env at the root of your project.*

The structure of the env file can be found in the configuration service.

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


