const { readFileSync, writeFileSync } = require("fs")
const { resolve } = require("path")

const { Version } = require("./version.js")

class Package {
  constructor(name, versionString, filePath) {
    this.name = name
    this.version = new Version(versionString)
    this.filePath = filePath
  }

  static fromJSON(json) {
    const { name, version } = JSON.parse(json)

    return new Package(name, version)
  }

  static fromFile(filePath) {
    console.log(`loading package configuration from file: ${filePath}`)

    const packageJsonContent = readFileSync(filePath)

    const newPackage = this.fromJSON(packageJsonContent)

    newPackage.filePath = resolve(filePath)

    return newPackage
  }

  /**
   *
   * @param {Version} newVersion
   */
  storeVersionInFile(newVersion) {
    this.version = newVersion

    if (!this.filePath) {
      throw new Error(`file path not defined`)
    }

    const packageJsonContent = readFileSync(this.filePath)
    const pacakgeJson = JSON.parse(packageJsonContent)

    pacakgeJson.version = this.version.toString()

    writeFileSync(this.filePath, JSON.stringify(pacakgeJson, null, 2))

    console.log(`updated file ${this.filePath}`)
  }
}

module.exports = { Package }
