import { newOctokit } from "./octokit.js"

/**
 * Dispatches a workflow run.
 * @param {string} owner Owner of the repository an event should be dispatched to.
 * @param {string} repo Repository an event should be dispatched to.
 * @param {string} workflowId Workflow ID in the repository an event should be dispatched to.
 * @param {string} ref Branch reference in the repository an event should be dispatched to.
 * @param {string} upstreamRef Input parameter `upstream_ref`.
 * @param {string} environment Input parameter `environment`.
 * @param {string} upstreamBuilds Input parameter `upstream_builds`.
 */
export async function dispatch(
  owner,
  repo,
  workflowId,
  ref,
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
      `\tworkflow_id: ${workflowId}\n` +
      `\tref: ${ref}\n` +
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
        ref: ref,
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
