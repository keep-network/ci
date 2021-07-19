const core = require("@actions/core")
const { notifyReleaseManager } = require("./src/notify.js")

async function run() {
  try {
    const module = core.getInput("module")
    const url = core.getInput("url")
    const environment = core.getInput("environment")
    const upstreamBuilds = core.getInput("upstream_builds") || "[]"
    const upstreamRef = core.getInput("upstream_ref")
    const version = core.getInput("version")

    const newUpstreamBuilds = await notifyReleaseManager(
      module,
      url,
      environment,
      upstreamBuilds,
      upstreamRef,
      version
    )

    core.info(
      `submitted notification for module: ${module} with:\n` +
        `\turl: ${url}\n` +
        `\tenvironment: ${environment}\n` +
        `\tupstream builds: ${newUpstreamBuilds}\n` +
        `\tupstream_ref: ${upstreamRef}\n` +
        `\tversion: ${version}`
    )
  } catch (error) {
    core.setFailed(error)
  }
}

run()
