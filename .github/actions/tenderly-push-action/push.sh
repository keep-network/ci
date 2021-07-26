#!/bin/bash

set -ex

if [[ -z $ETH_NETWORK_ID || -z $TENDERLY_PROJECT_SLUG ]]; then
    echo "one or more required variables are undefined"
    exit 1
fi

# Pushes contracts to Tenderly for the given network and project slug and optionally
# sets tag flags.
tenderly push \
    --networks $ETH_NETWORK_ID \
    --project-slug $TENDERLY_PROJECT_SLUG \
    ${GITHUB_PROJECT_NAME_TAG:+--tag $GITHUB_PROJECT_NAME_TAG} \
    ${VERSION_TAG:+--tag $VERSION_TAG}
