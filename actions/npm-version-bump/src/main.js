const core = require("@actions/core")
const { join } = require("path")
const { convertBranch, resolveWorkingDirectory } = require("./utils.js")

const { VersionResolver } = require("./version-resolver.js")

async function execute(workDir, isPrerelease, environment, branch, commit) {
  branch = convertBranch(branch)
  const packageJsonPath = join(resolveWorkingDirectory(workDir), "package.json")

  const versionResolver = new VersionResolver(
    packageJsonPath,
    environment,
    isPrerelease,
    branch,
    commit
  )

  let latestVersion = await versionResolver.getLatestPublishedVersion()

  // If no published versions are found use the current one from package.json.
  if (!latestVersion) {
    const currentVersion = versionResolver.package.version

    core.info(`latest version not found; using current ${currentVersion}`)
    latestVersion = currentVersion
  }

  core.info(`saving version ${latestVersion} to package.json file`)
  versionResolver.package.storeVersionInFile(latestVersion.toString())

  const newVersion = await versionResolver.bumpVersion()

  core.info(`version bumped to: ${newVersion}`)

  core.setOutput("version", newVersion.toString())

  return newVersion.toString()
}

module.exports = { execute }
