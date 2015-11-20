#!/usr/bin/env bash

WORKDIR=$(pwd)
SCRIPT_PATH=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
BASE_PATH="${SCRIPT_PATH}/.."

echo "Composing..."
mv ${BASE_PATH}/vendor ${BASE_PATH}/vendor_dev
composer install --no-ansi --no-dev --optimize-autoloader

echo "Packing code..."
vendor/bin/robo build
echo "Shipping code..."
vendor/bin/robo deploy

rm -rf ${BASE_PATH}/vendor
mv ${BASE_PATH}/vendor_dev ${BASE_PATH}/vendor

echo "Deployment done!"
cd ${WORKDIR}
