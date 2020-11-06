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
    const { argv } = this

    const issue = await this.Jira.createIssue({
      fields: {
        project: { key: argv.project },
        issuetype: { name: argv.issuetype },
        description: argv.description,
        summary: argv.summary,
        labels: this.parseLabels(argv.labels)
      }
    })

    return { issue: issue.key }
  }

  parseLabels(labelsString) {
    return labelsString.split(',')
  }
}
