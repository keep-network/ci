import { Validator } from "jsonschema"

/**
 * @typedef {Build[]} UpstreamBuilds
 * @typedef {Object} Build
 * @property {string} module The name of the module that was built, including the
 * repository (e.g. github.com/keep-network/keep-core/solidity)
 * @property {string} ref The ref used for this build
 * @property {string} version The module version used for this build
 * @property {string} url A URL that points to the GitHub Action run in-browser
 */

const upstreamBuildsJsonSchema = `
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "items": { "$ref": "#/$defs/upstreamBuild" },
    "$defs": {
      "upstreamBuild": {
        "type": "object",
        "properties": {
          "module": {
            "type": "string"
          },
          "ref": {
            "type": "string"
          },
          "version": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        },
        "required": [
          "module",
          "ref",
          "version",
          "url"
        ]
      }
    }
  }
`

export function validateUpstreamBuilds(upstreamBuildsString) {
  const v = new Validator()
  const result = v.validate(
    JSON.parse(upstreamBuildsString),
    JSON.parse(upstreamBuildsJsonSchema)
  )

  if (result.errors && result.errors.length > 0) {
    return { isValid: false, errors: result.errors }
  } else {
    return { isValid: true }
  }
}
