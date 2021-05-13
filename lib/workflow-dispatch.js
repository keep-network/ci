import { newOctokit } from "./octokit.js"

/**
 * Dispatches a workflow run.
 * @param {string} owner
 * @param {string} repo
 * @param {string} workflowId
 * @param {string} upstreamRef
 * @param {string} environment
 * @param {string} upstreamBuilds
 */
export async function dispatch(
  owner,
  repo,
  workflowId,
  upstreamRef,
  environment,
  upstreamBuilds
) {
  const octokit = newOctokit()

  if (
    !(typeof upstreamBuilds === "string" || upstreamBuilds instanceof String)
  ) {
    try {
      upstreamBuilds = JSON.stringify(upstreamBuilds)
    } catch (err) {
      throw new Error(`failed to stringify upstream builds: ${err.message}`)
    }
  }

  console.info(
    `dispatching workflow event:\n` +
      `\trepo: ${owner}/${repo}\n` +
      `\tworkflow: ${workflowId}\n` +
      `\tupstream_ref: ${upstreamRef}\n` +
      `\tenvironment: ${environment}\n` +
      `\tupstream_builds: ${upstreamBuilds}`
  )

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
      {
        owner: owner,
        repo: repo,
        workflow_id: workflowId,
        upstream_ref: upstreamRef,
        inputs: {
          environment: environment,
          upstream_builds: upstreamBuilds,
          upstream_ref: upstreamRef,
        },
      }
    )
  } catch (err) {
    throw new Error(`failed to dispatch a workflow event: ${err.message}`)
  }
}
