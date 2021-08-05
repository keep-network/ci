/** @type {import ("@keep-network/ci/lib/upstream-builds.js" UpstreamBuilds) UpstreamBuilds }*/

const core = require("@actions/core")
const { dispatch } = require("@keep-network/ci")

/**
 * Notifies the release manager repository about build completion.
 * @param {string} module
 * @param {string} url
 * @param {string} environment
 * @param {string} previousUpstreamBuilds
 * @param {string} upstreamRef
 * @param {string} version
 * @return {string} Upstream builds
 */
async function notifyReleaseManager(
  module,
  url,
  environment,
  previousUpstreamBuilds,
  upstreamRef,
  version
) {
  core.info("appending current build info to upstream builds array")

  /** @type {UpstreamBuilds} */
  const newUpstreamBuilds = Array.from(JSON.parse(previousUpstreamBuilds))
  newUpstreamBuilds.push({
    module: module,
    upstream_ref: upstreamRef,
    version: version,
    url: url,
  })

  const newUpstreamBuildsString = JSON.stringify(newUpstreamBuilds)

  core.debug(`upstream builds: ${newUpstreamBuildsString}`)

  await dispatch(
    "keep-network",
    "ci",
    "main.yml",
    "main",
    upstreamRef,
    environment,
    newUpstreamBuildsString
  )

  return newUpstreamBuildsString
}

module.exports = { notifyReleaseManager }
