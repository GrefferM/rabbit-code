#!/bin/bash

node --require dotenv/config \
./node_modules/typeorm/cli-ts-node-commonjs.js \
migration:run -d dist/common/database/typeorm-config/orm-config.js
