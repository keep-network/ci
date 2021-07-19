const { expect } = require("chai")

const { resolve, dirname } = require("path")
const { rmdirSync, existsSync, writeFileSync, mkdirSync } = require("fs")
const { execute } = require("../src/main.js")

const TEMP_DIR = "./tmp"

describe("Main", function () {
  describe("execute", () => {
    const isPrerelease = true
    const defaultEnvironment = "pre"
    const defaultPackageName = "@keep-network/keep-core"
    const branch = "feature/branch.2"
    const commit = "1234abcd7890XYZ"

    let subDirNumber = 0
    let testFilePath

    before(() => {
      if (existsSync(TEMP_DIR)) rmdirSync(TEMP_DIR, { recursive: true })
      if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR)
    })

    beforeEach(() => {
      testFilePath = resolve(
        TEMP_DIR,
        `execute-${subDirNumber}`,
        "package.json"
      )

      mkdirSync(dirname(testFilePath))
    })

    afterEach(() => {
      subDirNumber++
    })

    it("stores new value in package.json file", async () => {
      const initialVersion = "1.3.0"

      const packageJson = {
        name: "@keep-network/keep-core",
        version: initialVersion,
      }

      writeFileSync(testFilePath, JSON.stringify(packageJson))

      const newVersion = await execute(
        dirname(testFilePath),
        isPrerelease,
        defaultEnvironment,
        branch,
        commit
      )

      expect(newVersion).to.not.equal(initialVersion)

      const resultFile = require(testFilePath)

      expect(resultFile.version).to.equal(newVersion)
    })

    it("updates version for published base version", async () => {
      await verify("1.7.0", "1.7.1-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for not-published base version", async () => {
      await verify("1.7.1", "1.7.2-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for published pre version", async () => {
      await verify(
        "1.7.0-pre.7",
        "1.7.1-pre.0+feature-branch-2.1234abcd7890XYZ"
      )
    })

    it("updates version for published pre version that has newer rc version", async () => {
      await verify("1.3.0-pre", "1.3.1-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for rc version", async () => {
      await verify("1.7.1-rc.0", "1.7.1-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("bumps build version for already published pre version", async () => {
      await verify("1.8.0-pre", "1.8.0-pre.17+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for not published version with lesser preid", async () => {
      await verify("9.0.0-dev", "9.0.0-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for not published version with the same preid", async () => {
      await verify("9.0.0-pre", "9.0.0-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for not published version with greater preid", async () => {
      await verify("9.0.0-rc", "9.0.0-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for not published version with base only", async () => {
      await verify("9.0.0", "9.0.1-pre.0+feature-branch-2.1234abcd7890XYZ")
    })

    it("updates version for non-published preid", async () => {
      await verify(
        "1.3.1-pre",
        "1.3.1-testenv.0+feature-branch-2.1234abcd7890XYZ",
        "testenv"
      )
    })

    it("updates version for non-published preid and environment", async () => {
      await verify(
        "1.3.1-test",
        "1.3.1-testenv.0+feature-branch-2.1234abcd7890XYZ",
        "testenv"
      )
    })

    it("updates version for already published environment that don't match initial preid", async () => {
      await verify(
        "1.1.2-pre",
        "1.1.2-ropsten.1+feature-branch-2.1234abcd7890XYZ",
        "ropsten",
        "@keep-network/tbtc"
      )
    })

    // TODO: Add tests for versions bumps of already published packages

    async function verify(
      initialVersion,
      expectedVersion,
      environment = defaultEnvironment,
      packageName = defaultPackageName
    ) {
      const packageJson = {
        name: packageName,
        version: initialVersion,
      }

      writeFileSync(testFilePath, JSON.stringify(packageJson))

      const actual = await execute(
        dirname(testFilePath),
        isPrerelease,
        environment,
        branch,
        commit
      )

      expect(actual).to.equal(expectedVersion)
    }
  })
})
