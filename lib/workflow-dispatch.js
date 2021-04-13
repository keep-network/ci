import { newOctokit } from "./octokit.js"

/**
 * Dispatches a workflow run.
 * @param {string} owner
 * @param {string} repo
 * @param {string} workflowId
 * @param {string} ref
 * @param {string} environment
 * @param {string} upstreamBuilds
 */
export async function dispatch(
  owner,
  repo,
  workflowId,
  ref,
  environment,
  upstreamBuilds
) {
  const octokit = newOctokit()

  if (typeof upstreamBuilds === "string" || upstreamBuilds instanceof String) {
    upstreamBuilds = JSON.stringify(upstreamBuilds)
  }

  console.info(
    `dispatching workflow event:\n` +
      `\trepo: ${owner}/${owner}\n` +
      `\tworkflow: ${workflowId}\n` +
      `\tref: ${ref}\n` +
      `\tenvironment: ${environment}\n` +
      `\tupstream_builds: ${upstreamBuilds}`
  )

  await octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      owner: owner,
      repo: repo,
      workflow_id: workflowId,
      ref: ref,
      inputs: {
        environment: environment,
        upstream_builds: upstreamBuilds,
        ref: ref,
      },
    }
  )
}
