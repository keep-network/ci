# Notify Workflow Completed GitHub Action

This is a GitHub Action that notifies release management workflow about a workflow
completion.

## Action Inputs

The action supports following input parameters:

- `url` (required)

- `environment` (optional, default: `dev`)

- `upstream_builds` (required)

- `upstream_ref` (optional, default: `main`)

- `version` (required)

## Action Usage

```yaml
- uses: keep-network/notify-workflow-completed@v1
  with:
    environment: test
    upstream_builds: ""
    upstream_ref: main
```

## External Workflow Configuration

It is required that the destination workflow the action is going to call handles
the following input parameters:

- `environment`

- `upstream_builds`

- `upstream_ref`

## Development

Install dependencies: `yarn install`

Fix linting: `yarn run lint:fix`

It's required to commit the content of `dist` directory after introducing changes
to the source code.
To build the code run: `yarn run prepare` and commit the contents
of the `dist` directory.
