const moment = require('moment');
const escapeStringRegexp = require('escape-string-regexp');

module.exports = class PostConditionBuilder {
  constructor() {
    this.condition = [];
    return this;
  }

  buildCondition(condition) {
    this.condition = condition;
  }

  addCreatedAt(from, to) {
    if (from != null && to != null) {
      this.condition.push({
        createdAt: {
          $gte: from,
          $lt: to,
        },
      });
    }
  }

  // 2018/3/4 今はduring = yearのみ
  // TODO: sortの種類によってcreatedAt or updatedAtを決めるロジックの実装
  addDuring(during, term = 'year') {
    if (during && during !== 'all') {
      this.condition.push({
        createdAt: {
          $gte: moment(during).startOf(term),
          $lte: moment(during).endOf(term),
        },
      });
    }
  }

  addSearchWord(searchWord) {
    if (searchWord && searchWord !== '') {
      const andWords = searchWord.match(/"([^"])+"/g);
      if (andWords && Array.isArray(andWords)) {
        const andCondition = andWords.map((word) => {
          searchWord = searchWord.replace(word, '');
          const doubleQuoteInsideWord = word.slice(1).slice(0, -1);
          return this.buildSearchCondition(doubleQuoteInsideWord);
        });
        this.condition.push({ $and: andCondition });
      }

      const orWords = searchWord.split(/\s+/);
      if (orWords && Array.isArray(orWords)) {
        const orCondition = orWords.map((word) => {
          searchWord = searchWord.replace(word, '');
          return this.buildSearchCondition(word);
        });
        this.condition.push({ $or: orCondition });
      }
    }
  }
  buildSearchCondition(word) {
    const escapedWord = escapeStringRegexp(word);
    return {
      $or: [
        { title: new RegExp(escapedWord, 'i') },
        { content: new RegExp(escapedWord, 'i') },
        { description: new RegExp(escapedWord, 'i') },
        { hostname: new RegExp(escapedWord, 'i') },
      ],
    };
  }

  addFilterType(filter) {
    if (filter && filter !== 'all') {
      this.condition.push({ type: filter });
    }
  }
};
