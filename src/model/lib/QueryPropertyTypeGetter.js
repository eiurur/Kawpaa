const path = require('path');

const { CONTENT_TYPES } = require(path.resolve('build', 'lib', 'constants'));

module.exports = {
  getFilterType(type) {
    switch (type) {
      case CONTENT_TYPES.IMAGE:
        return { type: CONTENT_TYPES.IMAGE };
      case CONTENT_TYPES.LINK:
        return { type: CONTENT_TYPES.LINK };
      case CONTENT_TYPES.TEXT:
        return { type: CONTENT_TYPES.TEXT };
      case CONTENT_TYPES.VIDEO:
        return { type: CONTENT_TYPES.VIDEO };
      default:
        return { type: 'all' };
    }
  },

  getSortType(type) {
    const ASCENDING = 1;
    const DESCENDING = -1;
    switch (type) {
      case 'updatedAtAsc':
        return { updatedAt: ASCENDING };
      case 'updatedAtDesc':
        return { updatedAt: DESCENDING };
      case 'createdAtAsc':
        return { createdAt: ASCENDING };
      case 'createdAtDesc':
        return { createdAt: DESCENDING };
      case 'siteNameAsc':
        return { siteName: ASCENDING };
      case 'siteNameDesc':
        return { siteName: DESCENDING };
      case 'numDoneAsc':
        return { numDone: ASCENDING };
      case 'numDoneDesc':
        return { numDone: DESCENDING };
      default:
        return { updatedAt: DESCENDING };
    }
  },
};
