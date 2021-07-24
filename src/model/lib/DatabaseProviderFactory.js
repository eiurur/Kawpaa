const {
  ArchiveProvider,
  UserProvider,
  PostProvider,
  DonePostProvider,
  FavoriteProvider,
  DoneHistoryProvider,
  ImageProvider,
  ImageRelativeProvider,
  PopularProvider,
  VideoProvider,
} = require('../provider');

module.exports = class DatabaseProviderFactory {
  static createProvider(name) {
    switch (name.toLowerCase()) {
      case 'archive':
        return new ArchiveProvider();
      case 'user':
        return new UserProvider();
      case 'post':
        return new PostProvider();
      case 'done':
        return new DonePostProvider();
      case 'favorite':
        return new FavoriteProvider();
      case 'donehistory':
        return new DoneHistoryProvider();
      case 'image':
        return new ImageProvider();
      case 'imageRelative':
        return new ImageRelativeProvider();
      case 'popular':
        return new PopularProvider();
      case 'video':
        return new VideoProvider();
      default:
        return new PostProvider(); // CAUTION: nullの方がいい？
    }
  }
};
