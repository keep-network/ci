const semver = require("semver")

/* 
<base-version>-<environment>.<build-number>+<branch>.<commit> 
*/
// FIXME: This pattern doesn't support branches with `.` character.
const VERSION_REGEXP =
  "^(?<baseVersion>\\d+\\.\\d+\\.\\d+)(?:-(?<environment>\\w+))?(?:\\.(?<buildNumber>\\d+))?(?:\\+(?<branch>[\\w\\-/]+))?(?:\\.(?<commit>\\w+))?$"

class Version {
  /**
   * @param {string} string
   */
  constructor(string) {
    if (!semver.valid(string)) {
      throw new Error(`invalid semver version: ${string}`)
    }

    const matchResult = string.match(VERSION_REGEXP)

    if (!matchResult)
      throw new Error(`failed to parse version string: ${string}`)

    this.baseVersion = matchResult.groups.baseVersion
    this.environment = matchResult.groups.environment
    this.buildNumber = matchResult.groups.buildNumber
    this.branch = matchResult.groups.branch
    this.commit = matchResult.groups.commit
  }

  /**
   * @return {string}
   */
  toString() {
    if (!this.baseVersion) throw new Error("base version not set")

    let result = this.baseVersion

    if (this.environment) result += `-${this.environment}`
    if (this.buildNumber) result += `.${this.buildNumber}`
    if (this.branch) result += `+${this.branch}`
    if (this.commit) result += `.${this.commit}`

    return result
  }
}

module.exports = { Version }
