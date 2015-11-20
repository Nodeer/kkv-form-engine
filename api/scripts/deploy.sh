#!/usr/bin/env bash

WORKDIR=$(pwd)
SCRIPT_PATH=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
BASE_PATH="${SCRIPT_PATH}/.."

echo "Composing..."
mv ${BASE_PATH}/vendor ${BASE_PATH}/vendor_dev
composer install --no-ansi --no-dev --optimize-autoloader

echo "Packing code..."
vendor/bin/robo build
echo "Shipping code for..."
vendor/bin/robo deploy

mv ${BASE_PATH}/vendor ${BASE_PATH}/vendor_dist && mv ${BASE_PATH}/vendor_dev ${BASE_PATH}/vendor
rm -rf ${BASE_PATH}/vendor_dist

echo "Deployment done!"
cd ${WORKDIR}
