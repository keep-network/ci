import { expect } from "chai"
import { parseQueriesArray } from "../src/query.js"

describe("query", function () {
  describe("parseQuery", () => {
    it("parses single query", async () => {
      const string =
        "keep-core-contracts-version = github.com/keep-network/keep-core/solidity#version"

      const expectedResult = [
        {
          module: "github.com/keep-network/keep-core/solidity",
          property: "version",
          output: "keep-core-contracts-version",
        },
      ]

      const result = parseQueriesArray(string)

      expect(result).deep.equal(expectedResult)
    })

    it("parses array of queries", async () => {
      const string = [
        "keep-core-contracts-version = github.com/keep-network/keep-core/solidity#version",
        "keep-core-version=github.com/keep-network/keep-core#version",
      ]

      const expectedResult = [
        {
          module: "github.com/keep-network/keep-core/solidity",
          property: "version",
          output: "keep-core-contracts-version",
        },
        {
          module: "github.com/keep-network/keep-core",
          property: "version",
          output: "keep-core-version",
        },
      ]

      const result = parseQueriesArray(string)

      expect(result).deep.equal(expectedResult)
    })

    it("throws error for invalid string", async () => {
      const string = "github.com/keep-network/keep-core/solidity#version"

      expect(() => parseQueriesArray(string)).to.throw(
        Error,
        "failed to parse query string: github.com/keep-network/keep-core/solidity#version"
      )
    })
  })
})
