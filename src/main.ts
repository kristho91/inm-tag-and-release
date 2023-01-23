import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const context = github.context

    const commit = core.getInput('commit') || context.sha
    const tagName = core.getInput('tag_name', {required: true})
    const releaseName = core.getInput('release_name') || tagName
    const body = core.getInput('body')
    const draft = core.getInput('draft') === 'true'
    const prerelease = core.getInput('prerelease') === 'true'

    const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
    const r = await octokit.rest.repos.createRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name: tagName,
      target_commitish: commit,
      name: releaseName,
      body,
      draft,
      prerelease
    })

    core.setOutput('id', r.data.id.toString())
    core.setOutput('html_url', r.data.html_url)
    core.setOutput('upload_url', r.data.upload_url)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
