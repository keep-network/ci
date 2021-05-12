/** @type {import ("./upstream-builds.js" UpstreamBuilds) UpstreamBuilds }*/

import { config } from "./config.js"
import { dispatch } from "./workflow-dispatch.js"
import core from "@actions/core"

export default class Module {
  /** @type {string} */ id
  /** @type {string} */ owner
  /** @type {string} */ repo

  /**
   * Expects module path `github.com/{owner}/{repo}/{submodule}` submodule is optional
   * @param {string} moduleID
   * */
  constructor(moduleID) {
    const array = moduleID.split("/")

    if (array.length < 3 || array.length > 4) {
      throw new Error(
        `invalid module descriptor length [${array.length}]; ${moduleID}`
      )
    }

    array.reverse()

    const prefix = array.pop()

    if (prefix != "github.com") {
      throw new Error(
        `invalid repository prefix ${prefix}, expected: [github.com]; ${moduleID}`
      )
    }

    this.id = moduleID
    this.owner = array.pop()
    this.repo = array.pop()
    this.submodule = array.pop()

    const { workflow } = config.getModuleConfig(moduleID)

    this.workflow = workflow

    return this
  }

  /**
   * @param {string} environment
   * @param {UpstreamBuilds} upstreamBuilds
   * @param {string} ref
   */
  async invoke(environment, upstreamBuilds, ref) {
    core.info(`invoking module: ${this.id}`)

    try {
      await dispatch(
        this.owner,
        this.repo,
        this.workflow,
        ref,
        environment,
        upstreamBuilds
      )
    } catch (err) {
      throw new Error(
        `failed to dispatch event for module ${this.id} error: [${err.message}]`
      )
    }
  }
}
