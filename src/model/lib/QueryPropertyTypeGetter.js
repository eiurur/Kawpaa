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

  // REF: https://stackoverflow.com/questions/66172034/mongoose-sort-breaks-skip-limit
  _allowNumberSort(sort) {
    return Object.assign({}, sort, { _id: -1 });
  },

  getSortType(type) {
    const ASCENDING = 1;
    const DESCENDING = -1;
    switch (type) {
      case 'updatedAtAsc':
        return this._allowNumberSort({ updatedAt: ASCENDING });
      case 'updatedAtDesc':
        return this._allowNumberSort({ updatedAt: DESCENDING });
      case 'createdAtAsc':
        return this._allowNumberSort({ createdAt: ASCENDING });
      case 'createdAtDesc':
        return this._allowNumberSort({ createdAt: DESCENDING });
      case 'siteNameAsc':
        return this._allowNumberSort({ siteName: ASCENDING });
      case 'siteNameDesc':
        return this._allowNumberSort({ siteName: DESCENDING });
      case 'numDoneAsc':
        return this._allowNumberSort({ numDone: ASCENDING });
      case 'numDoneDesc':
        return this._allowNumberSort({ numDone: DESCENDING });
      default:
        return this._allowNumberSort({ updatedAt: DESCENDING });
    }
  },
};
