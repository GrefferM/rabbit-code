#!/bin/bash

read -r -p 'Migration name: ' migrationName && \
npm run build && \
node --require dotenv/config \
./node_modules/typeorm/cli-ts-node-commonjs.js migration:generate \
-d src/common/database/typeorm-config/orm-config.ts \
src/common/database/migrations/"$migrationName"


