import core from "@actions/core"

import { execute } from "./src/main.js"

async function run() {
  try {
    const results = await execute(
      core.getInput("upstream-builds"),
      getInputAsArray("query"),
      core.getInput("fail-on-empty") == "true"
    )

    for (const [key, value] of Object.entries(results)) {
      core.info(`${key}: ${value}`)
      core.setOutput(key, value)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getInputAsArray(name, options) {
  return core
    .getInput(name, options)
    .split("\n")
    .map((s) => s.trim())
    .filter((x) => x !== "")
}

run()
