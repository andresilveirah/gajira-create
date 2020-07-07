const _ = require('lodash')
const Jira = require('./common/net/Jira')

module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    this.preprocessArgs()

    const { argv } = this

    const issue = await this.Jira.createIssue({
      fields: {
        project: { key: argv.project },
        issuetype: { name: argv.issuetype },
        description: argv.description,
        summary: argv.summary,
        labels: argv.labels
      }
    })

    return { issue: issue.key }
  }

  preprocessArgs () {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const summaryTmpl = _.template(this.argv.summary)
    const descriptionTmpl = _.template(this.argv.description)

    this.argv.summary = summaryTmpl({ event: this.githubEvent })
    this.argv.description = descriptionTmpl({ event: this.githubEvent })
  }
}
