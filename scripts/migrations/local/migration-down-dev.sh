#!/bin/bash

npm run build && \
node --require dotenv/config \
./node_modules/typeorm/cli-ts-node-commonjs.js \
migration:revert \
-d src/common/database/typeorm-config/orm-config.ts
