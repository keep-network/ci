const { isAbsolute, resolve, normalize } = require("path")
const ROOT_DIR = process.env.GITHUB_WORKSPACE || __dirname

/**
 * @param {string} string
 * @return {string}
 */
function convertBranch(string) {
  // Strip out `refs/heads/` and `refs/tags/` prefixes that are included in the
  // github context ref variable.
  string = string.replace(/^refs\/(heads|tags)\//, "")

  // Replace characters in the branch name:
  // - `/` is invalid for semver,
  // - `.` in the regexp we use for version metadata parsing it starts the commit
  //    hash part.
  return string.replace(/[\/\.]/g, "-")
}

function resolveWorkingDirectory(workDir) {
  if (isAbsolute(workDir)) {
    return normalize(workDir)
  } else {
    return resolve(ROOT_DIR, workDir)
  }
}

module.exports = { convertBranch, resolveWorkingDirectory }
