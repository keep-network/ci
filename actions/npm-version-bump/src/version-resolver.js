const core = require("@actions/core")
const { dirname } = require("path")
const { exec } = require("child_process")
const semverRsort = require("semver/functions/rsort")

const { Package } = require("./package.js")
const { Version } = require("./version.js")

const DEFAULT_ENVIRONMENT = "dev"
const DEFAULT_PREID = "pre"

class VersionResolver {
  /**
   * @param {string} packageJsonPath
   * @param {string} environment
   * @param {string} isPrerelease
   * @param {string} branch
   * @param {string} commit
   */
  constructor(packageJsonPath, environment, isPrerelease, branch, commit) {
    this.workingDir = dirname(packageJsonPath)

    this.package = Package.fromFile(packageJsonPath)

    if (!this.package || !this.package.name || !this.package.version) {
      throw new Error(
        `name and version have to be defined; ` +
          `found name: ${this.package.name}, version: ${this.package.version}`
      )
    }

    this.isPrerelease = isPrerelease || environment !== "mainnet"

    this.environment = environment || DEFAULT_ENVIRONMENT
    if (this.isPrerelease && !environment) {
      this.environment = VersionResolver.resolvePreidFromVersion(
        this.package.version
      )
    }

    this.branch = branch
    this.commit = commit

    core.debug(
      `initialized package version resolver with properties:\n` +
        `workingDir:   ${this.workingDir}\n` +
        `name:         ${this.package.name}\n` +
        `version:      ${this.package.version}\n` +
        `environment:  ${this.environment}\n` +
        `isPrerelease: ${this.isPrerelease}\n` +
        `branch:  ${this.branch}\n` +
        `commit:  ${this.commit}`
    )
  }

  /**
   * @param {Version} version
   * @return {string}
   */
  static resolvePreidFromVersion(version) {
    core.info(`resolving current version preid...`)

    let preid
    if (version && version.environment) {
      preid = version.environment
      core.info(`found preid: ${preid}`)
    } else {
      preid = DEFAULT_PREID
      core.info(`preid not found; using default: ${preid}`)
    }

    return preid
  }

  /**
   * @return {Version}
   */
  async getLatestPublishedVersion() {
    const name = this.package.name
    const currentVersion = this.package.version

    const query = `${name}@~${currentVersion}`

    core.info(`get latest version matching ${query}`)

    return new Promise((resolve, reject) => {
      const command = `npm view -json ${query} version`

      core.info(`$ ${command}`)
      exec(`cd ${this.workingDir} && ${command}`, (err, stdout, stderr) => {
        if (err != null) {
          return reject(err)
        }
        if (stderr) {
          core.error(stderr)
        }

        if (!stdout) {
          core.warning("command output is empty")
          return resolve()
        }

        core.debug(stdout)

        let versions
        try {
          versions = JSON.parse(stdout)
        } catch (err) {
          core.warn(
            `failed to parse output: [${err.message}] output: ${stdout}`
          )
          return resolve()
        }

        let latestVersion
        if (Array.isArray(versions)) {
          core.info(`found published versions: ${versions}`)

          // If it's a prerelease filter out versions that don't match the prerelease ID.
          if (this.isPrerelease) {
            versions = versions.filter((v) => {
              try {
                const version = new Version(v)
                if (!version.environment) {
                  // Include released version that doesn't have a prerelease ID.
                  return true
                }
                // Check if the prerelease version has the same prerelease ID.
                return version.environment === this.environment
              } catch (err) {
                reject(err)
              }
            })

            core.info(`filtered versions: ${versions}`)
          }

          // Reverse sort versions.
          versions = semverRsort(versions)

          latestVersion = versions[0]
        } else {
          latestVersion = versions
        }

        core.info(`latest published version: ${latestVersion}`)

        return resolve(latestVersion ? new Version(latestVersion) : undefined)
      })
    })
  }

  /**
   * @return {Version}
   */
  async bumpVersion() {
    if (!this.isPrerelease) {
      throw new Error("only prerelease version bump is supported")
    }

    return new Promise((resolve, reject) => {
      const command = `npm version prerelease --preid=${this.environment} --no-git-tag-version`

      core.info(`$ ${command}`)

      exec(`cd ${this.workingDir} && ${command}`, (err, stdout, stderr) => {
        if (err != null) {
          return reject(err)
        }
        if (stderr) {
          return reject(stderr)
        }

        if (!stdout) {
          core.warn("command output is empty")
          return resolve()
        }

        core.debug(stdout)

        let newVersion = stdout.trim()
        if (newVersion[0] === "v") newVersion = newVersion.substring(1)

        // npm version doesn't support adding metadata so we need to append them
        // manually, see: https://github.com/npm/npm/issues/12825
        const result = new Version(newVersion)

        if (this.environment) result.environment = this.environment
        if (this.branch) result.branch = this.branch
        if (this.commit) result.commit = this.commit

        try {
          this.package.storeVersionInFile(result)
        } catch (err) {
          return reject(
            new Error(`failed to store version in file: ${err.stack}`)
          )
        }

        return resolve(result)
      })
    })
  }
}

module.exports = { Version, VersionResolver }
