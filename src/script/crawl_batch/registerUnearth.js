// const path = require('path');

// const redisClient = require(path.resolve(
//   'build',
//   'model',
//   'cache',
//   'redisClient',
// ));
// const { logger } = require(path.resolve('logger'));
// const { UserProvider } = require(path.resolve('build', 'model', 'provider'));

// (async () => {
//   const crawler = new TweetCrawler();

//   try {
//     const users = await new UserProvider().findAll();
//     for (const user of users) {
//       const types = ['inbox', 'archive', 'done']
//       const terms = [...Array(10).keys()].map(i => ++i).map(i => i * 12)
//       const condition = UnearthService.Condition({});
//       await UnearthService.find('day', condition);
//     }
//   } catch (e) {}
// })();
