# ci

The `ci` repository stores configuration files, libraries and custom GHA actions
that are used in the Keep/tBTC Continous Integration process. It also contains
the GitHub Actions workflow (`Main`) that acts as an entry point for
inter-module builds.

## Storing environment-specific variables

Non-confidential, environment/network-specific variables used in some of the
GitHub Actions workflows across `keep-network` repositories are stored in the
`*.env` files under `config/env`. The `keep-network/load-env-variables` GH
Action can be used to retrieve the data and load it to the workflow runner's
context. Learn more from the Actions'
[README](https://github.com/keep-network/load-env-variables/blob/main/README.md).

## Inter-module dependency management

The `Main` workflow (accessible via `Actions` tab) acts as a single entry point
for inter-module builds. Triggering this workflow via a workflow_dispatch event
will start the chain of automatic executions of the workflows which
build/publish Keep/tBTC modules, according to the order specified in the
`config/config.json` file. Properly configured order allows the system to
execute the downstream builds only after the upstream dependencies are built and
published.

To trigger the `Main` workflow, one needs to provide the following four inputs:

| Label             | Name | Required? | Default value      | Meaning |
|-------------------|------|-----------|--------------------|--------|
| Use workflow from |      | Yes       | `Branch: master`   | Specifies which version of the `Main`‘s workflow config file will be used. |
| The environment to run the build for | `environment` | No | `ropsten` | Specified value will be passed between downstream builds and used for package versioning and dependency management (the provided string will be part of a package's version name). |
| Upstream builds | `upstream_builds` | No | &lt;empty> | A list of upstream builds that should be used for the building of downstream modules. |
| Ref |`upstream_ref` | No | `master` | Specifies the branch on which the modules will be built. | 

Learn more about the deployment process and the meaning of the workflow inputs
by visiting
[Coda](https://coda.io/d/Building-Keep_d-fmEgBNFVH/Current-CI-process_su1ww#_lupK9).

## Custom GitHub Actions actions

The repository stores a couple of custom GitHub Actions which are used in the
Keep/tBTC Continous Integration process. The actions' code is kept in the
`actions` directory. Currently, following actions are stored (you can learn more
about them by reading their READMEs):
* [load-env-variables](./actions/load-env-variables)
* [notify-workflow-completed](./actions/notify-workflow-completed)
* [run-workflow](./actions/run-workflow)
* [upstream-builds-query](./actions/upstream-builds-query)

## Development

Part of the code stored in the `ci` repository is used as a dependency in the
actions stored in that repository. If this `ci` code gets modified, the code of
the actions referencing it needs to be rebuilt in order for the changes to take
effect.

Code that is referenced by some of the actions:
* `config/**` (excluding `config/env/**`)
* `lib/**`

Actions requiring rebuild after changes in above files:
* [notify-workflow-completed](./actions/notify-workflow-completed)
* [run-workflow](./actions/run-workflow)
* [upstream-builds-query](./actions/upstream-builds-query)

Refer to the READMEs of those actions for more information about rebuilding the
code.

## Monitoring

The following tools can be used to monitor state of the code and deployments:
* [AllTheKeeps for Ropsten](https://allthekeeps.test.keep.network/deposits)
* [Keep Clients Summary](https://monitoring.test.keep.network/d/3r-BohOMz/keep-clients-summary?orgId=1&refresh=30s)
<!-- Meercode has stopped displaying results when Organization or Repository
filter is applied. I reported the issue via the Feedback tool. Until issue gets
fixed, I'm commenting out the links to the Meercode dashboards. Instead, I'm
adding links to GH Actions filters that may be useful.
* Meercode Dashboards with GitHub Actions results:
  - [Relay request submitter / Testnet](https://meercode.io/public/list/af470c2ebc0da4a0b0cce2589660781e:f385a85f1b9ca5b44b35b1d61405b8569c4664f6cf41a8e71283d45ff4ff61b8f20f11dbb75d767c51a809ccd2ea06af)
  - [E2E and other scheduled tests in `local-setup`](https://meercode.io/public/list/07e8ed6fc354cb325b817626d09f6dce:c275abc3348031a1db35d79bd48533492d2ece50ae1f6cc696285b2064e33e8a35656aeaba4375687c8491e0fa44cb32)
  - [Daily builds and unit tests in `keep-core`](https://meercode.io/public/list/8658c17fc7593705fa105554536944eb:e630b20f8cb551d86d965e7134c96588e0959d8a66c9c74a92d913e3884d66f5e72cb4168d59fe0b78e17a1efebaec11/)
  - [Daily builds and unit tests in other repositories](https://meercode.io/public/list/996bf02d60c51e6ec3143e910a2f2afb:3d43f754b84d6a07209a882c825e273284b07de775fdcb2503e5d425f034c57c920ba8175aa1d7fff01cc6159ac9f80f)
  - [Deployment on Ropsten](https://meercode.io/public/list/41935b8f5ffcabfd0c0d63412547d720:1c3901d698c5c033914774f1cc5b8ffed254357a89c7a59b20f0c909db2141aa3e23b7a2080036f914c66f3f5cd69fdf) -->
* GitHub Actions workflows triggered by a cron:
  - [local-setup](https://github.com/keep-network/local-setup/actions?query=event%3Aschedule)
  - [keep-core](https://github.com/keep-network/keep-core/actions?query=event%3Aschedule)
  - [keep-ecdsa](https://github.com/keep-network/keep-ecdsa/actions?query=event%3Aschedule)
  - [tbtc](https://github.com/keep-network/tbtc/actions?query=event%3Aschedule)
  - [tbtc-v2](https://github.com/keep-network/tbtc-v2/actions?query=event%3Aschedule)
  - [coverage-pools](https://github.com/keep-network/coverage-pools/actions?query=event%3Aschedule)
  - [tbtc.js](https://github.com/keep-network/tbtc.js/actions?query=event%3Aschedule)
  - [tbtc-dapp](https://github.com/keep-network/tbtc-dapp/actions?query=event%3Aschedule)
* GitHub Actions workflows triggered manually:
  - [keep-core](https://github.com/keep-network/keep-core/actions?query=event%3Aworkflow_dispatch)
  - [keep-ecdsa](https://github.com/keep-network/keep-ecdsa/actions?query=event%3Aworkflow_dispatch)
  - [tbtc](https://github.com/keep-network/tbtc/actions?query=event%3Aworkflow_dispatch)
  - [tbtc-v2](https://github.com/keep-network/tbtc-v2/actions?query=event%3Aworkflow_dispatch)
  - [coverage-pools](https://github.com/keep-network/tbtc-v2/actions?query=event%3Aworkflow_dispatch)
  - [tbtc.js](https://github.com/keep-network/tbtc.js/actions?query=event%3Aworkflow_dispatch)
  - [tbtc-dapp](https://github.com/keep-network/tbtc-dapp/actions?query=event%3Aworkflow_dispatch)