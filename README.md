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
* Meercode Dashboards with GitHub Actions results:
  - [Relay request submitter / Testnet](https://meercode.io/public/list/af470c2ebc0da4a0b0cce2589660781e:f385a85f1b9ca5b44b35b1d61405b8569c4664f6cf41a8e71283d45ff4ff61b8f20f11dbb75d767c51a809ccd2ea06af)
  - [E2E tests in `local-setup`](https://meercode.io/public/list/acef9c5954837d43d0249f46d8c38306:2f621d7a4bbef9f85bb4430a88ead6d456ebdadbb7df6fb51a0aab7c10ec457031e7b0f0ee6b0408c7654a3a51057998)
  - [Daily builds and unit tests](https://meercode.io/public/list/a35b93b575273416124a32f8cd9d1d5f:60fde75491810d92b496eed2bb3ce55ec4124ca10a75cb4273dcad863e8f4d94b51fbbbe4cb07ecbfb40fc4edef71464)
  - [Deployment on Ropsten](https://meercode.io/public/list/41935b8f5ffcabfd0c0d63412547d720:1c3901d698c5c033914774f1cc5b8ffed254357a89c7a59b20f0c909db2141aa3e23b7a2080036f914c66f3f5cd69fdf)
