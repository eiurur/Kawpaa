const Slack = require('slack-node');
const path = require('path');

require('dotenv').config();

module.exports = class SlackLogger {
  constructor({
    channel = process.env.SLACK_LOGGER_CHANNEL,
    username = process.env.SLACK_LOGGER_USERNAME,
    webhookUri = process.env.SLACK_LOGGER_WEBHOOK_URL,
  } = {}) {
    this.channel = channel;
    this.username = username;
    this.webhookUri = webhookUri;
    this.slack = new Slack();
    this.slack.setWebhook(webhookUri);
    return this;
  }

  send({ text, attachments = {} }) {
    return new Promise((resolve, reject) => {
      this.slack.webhook(
        {
          channel: this.channel,
          username: this.username,
          text,
          attachments,
        },
        (err, response) => {
          if (err) {
            return reject(err);
          }
          return resolve(response);
        }
      );
    });
  }
};
