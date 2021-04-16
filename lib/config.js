import core from "@actions/core"

import { readFileSync } from "fs"
import Module from "./module.js"

/**
 * @typedef {Object} ModuleConfig
 * @property {string} workflow
 * @property {[string]} downstream // NOTE: Dependencies should be defined in a linear way with max 1 downstream build
 */

export class Config {
  /** @type {string} */ defaultModuleID
  /** @type {Object.<string, ModuleConfig>} */ modules

  constructor(configFilePath) {
    const config = JSON.parse(readFileSync(configFilePath))

    this.defaultModuleID = config.defaultModule
    this.modules = config.modules

    this.validateConfiguration()
  }

  validateConfiguration() {
    core.info(`validating dependencies configuration file`)

    if (!this.defaultModuleID) throw new Error(`default module is not defined`)

    if (!this.modules || !Object.keys(this.modules).length)
      throw new Error(`missing modules configuration`)

    if (!this.modules[this.defaultModuleID])
      throw new Error("missing configuration for default module")

    for (const [moduleID, config] of Object.entries(this.modules)) {
      if (!config.workflow)
        throw new Error(`workflow not defined for module ${moduleID}`)

      this.validateDownstream(moduleID)
    }
  }

  validateDownstream(moduleID, stack = []) {
    const moduleConfig = this.getModuleConfig(moduleID)

    const { downstream } = moduleConfig

    if (!downstream) return

    for (const downstreamModule of downstream) {
      if (stack.includes(downstreamModule))
        throw new Error(
          `cyclic dependency found in module ${moduleID} to ${downstreamModule}`
        )

      stack.push(downstreamModule)
      this.validateDownstream(downstreamModule, stack)
    }
  }

  get defaultModule() {
    return new Module(this.defaultModuleID)
  }

  getModuleConfig(moduleID) {
    const moduleConfig = this.modules[moduleID]
    if (!moduleConfig)
      throw new Error(`missing configuration for module ${moduleID}`)

    return moduleConfig
  }

  /**
   *
   * @param {string} moduleID
   * @return {ModuleConfig}
   */
  getModule(moduleID) {
    return new Module(moduleID)
  }
}

const defaultConfigPath = () => {
  // https://nodejs.org/api/esm.html#esm_no_json_module_loading
  const { pathname: defaultConfigFilePath } = new URL(
    "../config/config.json",
    import.meta.url
  )

  return defaultConfigFilePath
}

let defaultConfigInstance
/**
 * @return {Config}
 */
function getDefaultConfig() {
  if (!defaultConfigInstance)
    defaultConfigInstance = new Config(defaultConfigPath())

  return defaultConfigInstance
}

export const config = getDefaultConfig()
