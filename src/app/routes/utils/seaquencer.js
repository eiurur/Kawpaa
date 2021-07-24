const path = require('path');

const { httpException } = require(path.resolve('build', 'domains', 'exceptions', 'httpException'));
const { logger } = require(path.resolve('logger'));
const SlackLogger = require(path.resolve('build', 'lib', 'utils', 'SlackLogger'));

exports.seaquencer = (req, res, resolver) => {
  const onResp = (resp) => {
    if (resp !== null) {
      return res.status(200).send(resp);
    }
    throw httpException.BadRequest();
  };

  const onError = (error) => {
    logger.error('seq onError statusCode =>  ', error.statusCode);
    logger.error('seq onError message =>  ', error.message);
    logger.error('seq onError trace=>  ', error.stack);

    const statusCode = !error.statusCode ? 500 : error.statusCode;
    const message = JSON.stringify(error.message || error);
    const user = req.user || {
      name: 'Anonymous',
      screenName: 'Anounymous',
      icon: 'https://assets.tumblr.com/images/anonymous_avatar_96.gif',
    };

    new SlackLogger()
      .send({
        text: `${statusCode} - ${message}`,
        attachments: [
          {
            // fallback: 'Required plain-text summary of the attachment.',
            color: 'danger',
            author_name: `${user.screenName} @${user.name}`,
            author_link: `https://twitter.com/${user.name}`,
            author_icon: user.icon,
            title: `StatudCode - ${statusCode}`,
            title_link: `https://twitter.com/${user.name}`,
            text: JSON.stringify(req.params.post),
            fields: [
              {
                title: 'StackTrace',
                value: JSON.stringify(error.stack),
                short: false,
              },
            ],
          },
        ],
      })
      .catch((err) => {
        logger.info(err);
      });
    return res.status(statusCode).send(message);
  };

  return resolver.then(onResp).catch(onError);
};
