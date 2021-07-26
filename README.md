# Upstream Builds Query Action

[![build](https://github.com/keep-network/upstream-builds-query/actions/workflows/build.yml/badge.svg)](https://github.com/keep-network/upstream-builds-query/actions/workflows/build.yml)
[![test](https://github.com/keep-network/upstream-builds-query/actions/workflows/test.yml/badge.svg)](https://github.com/keep-network/upstream-builds-query/actions/workflows/test.yml)

<!-- TODO: Write documentation -->
## Usage

<!-- prettier-ignore-start -->
```yaml
- uses: keep-network/upstream-builds-query@v1
  id: upstream-builds-query
  with:
    upstream-builds: ${{ github.event.inputs.upstream_builds }}
    fail-on-empty: false # default: true
    query: |
        keep-core-contracts-version = github.com/keep-network/keep-core/solidity#version
        tbtc-contracts-version = github.com/keep-network/tbtc/solidity#version
```
<!-- prettier-ignore-end -->

## Outputs

The action outputs property with a value of the resolved package version.

Example usage:

```yaml
- uses: keep-network/upstream-builds-query@v1
  id: upstream-builds-query
  with:
    upstream-builds: ${{ github.event.inputs.upstream_builds }}
    query: |
        keep-core-contracts-version = github.com/keep-network/keep-core/solidity#version
        tbtc-contracts-version = github.com/keep-network/tbtc/solidity#version
- name: Print resolved version
  run: |
    echo "Resolved version: ${{ steps.upstream-builds-query.outputs.keep-core-contracts-version }}"
    echo "Resolved version: ${{ steps.upstream-builds-query.outputs.tbtc-contracts-version }}"
```
