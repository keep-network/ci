const { convertBranch } = require("../src/utils.js")

const { expect } = require("chai")

describe("Utils", function () {
  describe("convertBranch", () => {
    it("strips out refs/heads/ prefix", async () => {
      const branch = "refs/heads/feature/branch/name.23.12"
      const expected = "feature-branch-name-23-12"

      const actual = convertBranch(branch)

      console.log("actual", actual)

      expect(actual).equal(expected)
    })

    it("strips out refs/tags/ prefix", async () => {
      const branch = "refs/tags/v1.12.4-pre"
      const expected = "v1-12-4-pre"

      const actual = convertBranch(branch)

      console.log("actual", actual)

      expect(actual).equal(expected)
    })

    it("replaces / with -", async () => {
      const branch = "feature/branch/name-23/12"
      const expected = "feature-branch-name-23-12"

      const actual = convertBranch(branch)

      console.log("actual", actual)

      expect(actual).equal(expected)
    })

    it("replaces . with -", async () => {
      const branch = "feature.branch.name-23.12"
      const expected = "feature-branch-name-23-12"

      const actual = convertBranch(branch)

      console.log("actual", actual)

      expect(actual).equal(expected)
    })

    it("mixed case", async () => {
      const branch = "feature/branch/name.23.12"
      const expected = "feature-branch-name-23-12"

      const actual = convertBranch(branch)

      console.log("actual", actual)

      expect(actual).equal(expected)
    })
  })
})
