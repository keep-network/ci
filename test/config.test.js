import { expect } from "chai"
import { config, Config } from "../lib/config.js"

describe("Config", function () {
  it("reads default configuration file", async () => {
    expect(config).to.be.an.instanceof(Config)
    expect(config).to.have.property("defaultModule")
    expect(config).to.have.property("modules")
  })

  it("reads configuration file", async () => {
    const expected = {
      defaultModuleID: "github.com/keep-network/keep-core/solidity",
      modules: {
        "github.com/keep-network/keep-core/solidity": {
          workflow: "contracts.yml",
          downstream: ["github.com/keep-network/keep-core"],
        },
        "github.com/keep-network/keep-core": { workflow: "client.yml" },
      },
    }

    const actual = new Config("./test/data/config-test.json")

    expect(actual).to.deep.equal(expected)
  })

  it("throws an error if default module is missing", async () => {
    expect(
      () => new Config("./test/data/config-missing-default-module.json")
    ).to.throw(Error, "default module is not defined")
  })

  it("throws an error if modules configuration is missing", async () => {
    expect(
      () => new Config("./test/data/config-missing-modules.json")
    ).to.throw(Error, "missing modules configuration")
  })

  it("throws an error if configuration for default module is missing", async () => {
    expect(
      () => new Config("./test/data/config-missing-default-module-config.json")
    ).to.throw(Error, "missing configuration for default module")
  })

  it("throws an error if workflow property is missing", async () => {
    expect(
      () => new Config("./test/data/config-missing-workflow.json")
    ).to.throw(
      Error,
      "workflow not defined for module github.com/keep-network/keep-ecdsa/solidity"
    )
  })

  it("throws an error if configuration for downstream module is missing", async () => {
    expect(() => new Config("./test/data/config-missing-module.json")).to.throw(
      Error,
      "missing configuration for module github.com/keep-network/keep-ecdsa/solidity"
    )
  })

  it("throws an error if cyclic dependency", async () => {
    expect(() => new Config("./test/data/config-cyclic.json")).to.throw(
      Error,
      "cyclic dependency found in module github.com/keep-network/tbtc/solidity to github.com/keep-network/keep-core"
    )
  })

  it("throws an error if configuration file doesn't exist", async () => {
    expect(() => new Config("./test/data/config-not-exist.json")).to.throw(
      Error,
      "no such file or directory"
    )
  })
})
