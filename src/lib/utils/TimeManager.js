const moment = require('moment');

module.exports = class TimeManager {
  /**
   *
   * @param {*} term
   * @param {*} date
   */
  static normalizeDate({ term, date }) {
    if (!['days', 'weeks', 'months', 'years'].includes(term)) {
      throw new Error('TimeManager.normalizeDate() allow "days" or "weeks" or "months" or "years"');
    }
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   *
   * @param {*} term
   * @param {*} date
   * @param {*} amount
   */
  static changeDate({ term, date, amount }) {
    if (!['days', 'weeks', 'months', 'years'].includes(term)) {
      throw new Error('TimeManager.changeDate() allow "days" or "weeks" or "months" or "years"');
    }
    return moment(date)
      .add(amount, term)
      .format('YYYY-MM-DD');
  }
};
