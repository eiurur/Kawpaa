const path = require('path');
const Queue = require('bull');

require('dotenv').config();

const REDIS_URI = process.env.REDIS_URI;

class JobQueueManager {
  constructor() {
    this.queues = {};
    this.parallel = 5;
  }

  /**
   * ジョブの定義を登録する
   * @param {String} name - ジョブ名
   * @param {String} connect - redisの接続先URL
   * @param {Function} process - ジョブ内容
   * @param {Function} completed - ジョブ実行完了後に処理するコールバック関数
   * @param {Function} failed - ジョブ実行失敗後に処理するコールバック関数
   * @return {Boolean} 登録の成功可否(true = 登録成功, false = 登録失敗/登録中止)
   */
  register({ name, connect, process, completed, failed }) {
    if (this.queues[name]) {
      return false;
    }

    const newQueue = new Queue(name, connect || REDIS_URI);
    newQueue.process(this.parallel, (job) => process(job));
    newQueue.on('completed', (job, result) => completed());
    newQueue.on('failed', (job, result) => failed());
    this.queues[name] = newQueue;
    return true;
  }

  /**
   * ジョブの定義を削除する、
   * @param {name} ジョブ名
   */
  remove({ name }) {
    delete this.queues[name];
  }

  /**
   * ジョブを追加する
   * @param {String} name - ジョブ名
   * @param {Object} params - ジョブに渡すパラメータ
   */
  add({ name, params }) {
    return this.queues[name].add(params);
  }

  /**
   * ジョブの定義を全てクリアする、
   */
  clear() {
    this.queues = [];
  }
}

const jobQueue = new JobQueueManager();

Object.freeze(jobQueue);

module.exports = jobQueue;
