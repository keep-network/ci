# Run GitHub Actions Workflow Action

This is a GitHub Action that runs an external workflow.

## Action Inputs

The action supports following input parameters:

- `environment` (optional, default: `dev`)

- `upstream_builds` (optional)

- `upstream_ref` (optional, default: `main`)

## Action Usage

```yaml
- uses: keep-network/run-workflow@v1
  with:
    environment: test
    upstream_builds: {}
    upstream_ref: main
```

## External Workflow Configuration

It is required that the destination workflow the action is going to call handles
the following input parameters:

- `environment`

- `upstream_builds`

- `upstream_ref`

Workflow configuration sample:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment for workflow execution'
        required: false
        default: 'dev'
      upstream_builds:
        description: 'Upstream builds'
        required: false
      upstream_ref:
        description: 'Git reference to checkout (e.g. branch name)'
        required: false
        default: 'main'
```

## Development

Install dependencies: `yarn install`

Fix linting: `yarn run lint:fix`

It's required to commit the content of `dist` directory after introducing changes
to the source code.
To build the code run: `yarn run prepare` and commit the contents
of the `dist` directory.
