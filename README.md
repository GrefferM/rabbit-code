# rabbit-code
## Installation
Copy configuration file `.env.example` to `.env`
```bash
$ npm ci
```

## Running the app (manual)
```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

## Running the app (docker-compose)
- Create `docker-compose.local.yaml` from `docker-compose.dev.yaml`:
- Create docker network
```bash
docker network create rabbit-code_network
```

## Migration example
### (Only for development environment)
```bash
# create the migration
$ npm run migration:gen
# Raise the migration version
$ npm run migration:up:dev
# Revert the migration
$ npm run migration:down:dev
```

## Test
```bash
# unit tests
$ npm run test
# test coverage
$ npm run test:cov
```
