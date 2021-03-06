import { expect } from "chai"

import { validateUpstreamBuilds } from "../lib/upstream-builds.js"

describe("Upstream Builds", () => {
  describe("validateUpstreamBuilds", () => {
    it("succeeds for array of two", async () => {
      const { isValid, errors } = validateUpstreamBuilds(
        `[{"module":"a","upstream_ref":"b","version":"c","url":"d"},{"module":"a2","upstream_ref":"b","version":"c","url":"d"}]`
      )

      expect(isValid).to.be.true
      expect(errors).to.be.undefined
    })

    it("succeeds for empty array", async () => {
      const { isValid, errors } = validateUpstreamBuilds("[]")

      expect(isValid).to.be.true
      expect(errors).to.be.undefined
    })

    it("fails for object", async () => {
      const { isValid, errors } = validateUpstreamBuilds(
        '{"module":"a","upstream_ref":"b"}'
      )

      expect(isValid).to.be.false
      expect(errors).to.have.lengthOf(1)
      expect(errors[0]).property("message", "is not of a type(s) array")
    })

    it("fails for missing required parameter", async () => {
      const { isValid, errors } = validateUpstreamBuilds('[{"module":"a"}]')

      expect(isValid).to.be.false
      expect(errors).to.have.lengthOf(1)
      expect(errors[0]).property("message", 'requires property "version"')
    })
  })
})
