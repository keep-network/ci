class Query {
  static REGEXP = "^(?<output>.*)=(?<module>.*)#(?<property>.*)$" // TODO: Dodać spacje

  constructor(string) {
    const matchResult = string.match(Query.REGEXP)

    if (!matchResult) throw new Error(`failed to parse query string: ${string}`)

    this.module = matchResult.groups.module.trim()
    this.property = matchResult.groups.property.trim()
    this.output = matchResult.groups.output.trim()
  }

  /**
   * @param {string} string
   * @return {Query}
   */
  static parse(string) {
    return new Query(string)
  }
}

/**
 * @param {string[]} array
 * @return {Query[]}
 */
export function parseQueriesArray(array) {
  if (typeof array === "string" || array instanceof String) {
    return [Query.parse(array)]
  }

  return array.map(Query.parse)
}
