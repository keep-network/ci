# NPM Package Version Bump Action

[![main](https://github.com/keep-network/npm-version-bump/actions/workflows/main.yml/badge.svg?branch=v2)](https://github.com/keep-network/npm-version-bump/actions/workflows/main.yml)
[![test](https://github.com/keep-network/npm-version-bump/actions/workflows/test.yml/badge.svg?branch=v2)](https://github.com/keep-network/npm-version-bump/actions/workflows/test.yml)

This is a GitHub Action that bumps version of a NPM Package.

The version is formatted according to the pattern described in the [RFC-18]:

```
<base-version>-<environment>.<build-number>+<branch>.<commit>
```

[RFC-18]:https://github.com/keep-network/keep-core/blob/master/docs/rfc/rfc-18-release-management.adoc#221-build-taggingpublishing

## Inputs

The action supports following input parameters:

- `work-dir` (optional, default: `.`) - location of `package.json` file,

- `is-prerelease` (optional, default: `true`) - defines if the version is a prerelease,
  currently only `true` is supported,

- `environment` (optional, default: `pre`) - prerelease id.

- `branch` (optional) - branch reference at which version is built

- `commit` (optional) - commit hash at which version is built

### Branch conversion

It's expected that `branch` parameter will be populated with [GitHub context `ref`
property](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context):

> The branch or tag ref that triggered the workflow run. For branches this in the format refs/heads/<branch_name>, and for tags it is refs/tags/<tag_name>.

To handle this value correctly in the resulting version format the provided
value is converted in the following way:

- `refs/heads/` and `refs/tag/` prefixes are stripped out,

- any `/` occurrence is replaced by `-`,

- any `.` occurrence is replaced with `-`.

## Usage

<!-- prettier-ignore-start -->
```yaml
- uses: keep-network/ci/actions/npm-version-bump@v1
  with:
    work-dir: ./contracts       # optional, default: .
    environment: "ropsten"      # optional, default: pre
    branch: ${{ github.ref }}   # optional
    commit: ${{ github.sha }}   # optional
```
<!-- prettier-ignore-end -->

## Outputs

The action outputs `version` property with a value of the resolved package version.

Example usage:

```yaml
- uses: keep-network/ci/actions/npm-version-bump@v2
  id: bump-version
- name: Print resolved version
  run: echo "Resolved new version ${{ steps.bump-version.outputs.version }}"
```
