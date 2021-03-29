import core from "@actions/core"

import { config, Module } from "@keep-network/ci"

/**
 * @param {string} environment
 * @param {UpstreamBuilds} upstreamBuilds
 * @param {string} ref
 */
export async function invoke(environment, upstreamBuilds, ref) {
  if (!upstreamBuilds) {
    const module = config.defaultModule

    core.info(
      `upstream builds not provided; invoking default module: ${module.id}`
    )

    await module.invoke(environment, upstreamBuilds, ref)
  } else {
    const latestBuild = upstreamBuilds.slice(-1)[0]

    await invokeDownstream(latestBuild.module, environment, upstreamBuilds, ref)
  }
}

/**
 * @param {string} moduleID
 * @param {string} environment
 * @param {UpstreamBuilds} upstreamBuilds
 * @param {string} ref
 */
async function invokeDownstream(
  moduleID,
  environment,
  upstreamBuilds,

  ref = "master"
) {
  const moduleConfig = config.getModuleConfig(moduleID)

  const { downstream } = moduleConfig
  if (!downstream) {
    core.info("no downstream modules defined; exiting")
    return
  }

  core.info(`invoking downstream builds for module ${moduleID}`)
  for (const downstreamModuleID of downstream) {
    const downstreamModule = new Module(downstreamModuleID)
    downstreamModule.invoke(environment, upstreamBuilds, ref)
  }
}
