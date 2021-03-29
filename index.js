import core from "@actions/core"
import { invoke } from "./src/invoke.js"

async function run() {
  try {
    const environment = core.getInput("environment")
    const upstreamBuilds = core.getInput("upstream_builds")
    const ref = core.getInput("ref")

    await invoke(environment, upstreamBuilds, ref)

    core.info(
      `dispatched run for environment: ${environment} with upstream builds: ${upstreamBuilds} and ref: ${ref}`
    )
  } catch (error) {
    core.setFailed(error)
  }
}

run()
