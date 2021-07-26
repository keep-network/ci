const { Version } = require("../src/version.js")

const { expect } = require("chai")

describe("Version", function () {
  const testData = {
    "123.456.789": {
      baseVersion: "123.456.789",
      environment: undefined,
      buildNumber: undefined,
      branch: undefined,
      commit: undefined,
    },

    "123.456.789-rc": {
      baseVersion: "123.456.789",
      environment: "rc",
      buildNumber: undefined,
      branch: undefined,
      commit: undefined,
    },
    "123.456.789-rc.246": {
      baseVersion: "123.456.789",
      environment: "rc",
      buildNumber: "246",
      branch: undefined,
      commit: undefined,
    },
    "1.0.1-ropsten.5": {
      baseVersion: "1.0.1",
      environment: "ropsten",
      buildNumber: "5",
      branch: undefined,
      commit: undefined,
    },
    "123.456.789-rc.246+feature-branch-name-23": {
      baseVersion: "123.456.789",
      environment: "rc",
      buildNumber: "246",
      branch: "feature-branch-name-23",
      commit: undefined,
    },
    "123.456.789-rc.246+feature-branch-name-23.fdshoi12fsidj09fj0id": {
      baseVersion: "123.456.789",
      environment: "rc",
      buildNumber: "246",
      branch: "feature-branch-name-23",
      commit: "fdshoi12fsidj09fj0id",
    },
  }

  describe("parses string", () => {
    for (const [string, expectedVersion] of Object.entries(testData)) {
      it(`${string}`, () => {
        const actual = new Version(string)

        expect(actual, `invalid parsing result for ${string}`).deep.equal(
          expectedVersion
        )

        expect(
          actual.toString(),
          `invalid to string result for ${string}`
        ).equal(string)
      })
    }
  })

  it("throws an error if invalid version", async () => {
    expect(
      () => new Version("123.456.789-rc.246+feature/branch/name-23")
    ).to.throw(
      Error,
      "invalid semver version: 123.456.789-rc.246+feature/branch/name-23"
    )
  })

  it("throws an error if invalid version", async () => {
    expect(() => new Version("123.456X")).to.throw(
      Error,
      "invalid semver version: 123.456X"
    )
  })
})
