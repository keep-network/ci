#!/bin/bash
# Exit on error
set -e

if ! [ -x "$(command -v curl)" ]; then echo "curl is not installed"; exit 1; fi

echo "-- Downloading config file: $1 ..."
set -x
curl \
  --header "Accept: application/vnd.github.v3.raw" \
  --output "$1" \
  --show-error \
  --fail \
  --location https://api.github.com/repos/keep-network/ci/contents/config/env/$1?ref=$2
set +x

if [[ ! -f $1 ]] ; then
  echo "File $1 not downloaded, aborting. Check if the file $1 exists in 'keep-network/ci/config/env/' on the branch you provided."
  exit 1
fi