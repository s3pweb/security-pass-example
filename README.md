# S3PWeb - Security Pass example

## Description

This repository is an example project to show how to access security pass events (using the NestJs framework).

The `app.service.ts` file contains the main logic of this application
(2 CRONs, one to get all current access requests and another one to get the associated events).

The `accesses.service.ts` file contains a function to get all current accesses.

The `events.service.ts` file contains a function to get the events and a function to process the events.

## Installation

Use node 20 and create a `.env` file containing the following:

```properties
API_URL=
TOKEN=
```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# development watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
