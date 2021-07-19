# Load environment variables GitHub Action

This is a GitHub Action that adds the values from specified environment-specific
config file to the list of GitHub environment variables. Config file must be
stored in `keep-network/ci` repository under `./config/env/` directory.

Once imported, the variables can be used in GitHub Action's job by referencing
`env` context.

## Action inputs

The action supports following input parameters:

- `environment` (required)

- `ref` (optional, default: `main`)

## Action usage

```yaml
      - uses: keep-network/ci/actions/load-env-variables@v1
        with:
          environment: 'ropsten'
```

## Configuration of the input file

Config file listing variables to be imported must be stored in `keep-network/ci`
repository under `./config/env/` directory. The idea is to have
separate config files for separate environments.

The name of each file should indicate the name of the environment to which
the variables' values apply and should have `.env` extension (e.g. `ropsten.env`). 

Variables stored in the file must be written in the `name=value` format.

Example:
```
FIRST_ENV_VAR=first-var
SECOND_ENV_VAR=This is second variable
```

**WARNING:** Do not store sensitive information in the config files. For storing 
sensitive data, use GitHub's _Secrets_ functionality.

## Using imported variables

Imported variables can be accessed from the `env` context in the job in which
action was used. To use the variables in a different job, you must invoke the
`load-env-variables` action there as well .

Example:
```yaml
name: Main

on: [push]

jobs:
  run-action:
    runs-on: ubuntu-latest
      - name: Load environment variables
        uses: keep-network/ci/actions/load-env-variables@v1
        with:
          filename: 'ropsten'
      - name: Use loaded variables
        # Will print "My first variable: first-var".
        run: |
          echo "My first variable: ${{ env.FIRST_ENV_VAR }}"
```
