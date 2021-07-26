const { Package } = require("../src/package.js")
const { VersionResolver } = require("../src/version-resolver.js")

const { expect } = require("chai")

const PACKAGE_JSON_FILE_PATH = "./test/data/package.json"

describe.skip("VersionResolver", function () {
  describe.skip("fromFile", () => {
    it("loads package data from a JSON file", async () => {
      const packageObj = new Package(
        "@keep-network/keep-core",
        "1.2.3-rc",
        "package.json"
      )
      const expected = {}

      const actual = new VersionResolver("workDir", packageObj)

      expect(actual).deep.equal(expected)
    })
  })

  describe.skip("bumpVersion", () => {
    it("bumps version", async () => {
      const actual = new VersionResolver(PACKAGE_JSON_FILE_PATH, "ropsten")

      console.log("actual.bumpVersion", await actual.bumpVersion())
    })
  })
})
