import { Octokit } from "@octokit/core"

function newOctokit() {
  if (!process.env.GITHUB_TOKEN)
    throw new Error(`env variable GITHUB_TOKEN not defined`)

  return new Octokit({ auth: process.env.GITHUB_TOKEN })
}

export default newOctokit()
