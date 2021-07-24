const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const request = require('request');
const moment = require('moment');
const crypto = require('crypto');

const { logger } = require(path.resolve('logger'));

const my = function () {
  // module.exports = class My

  return {
    c(description, str) {
      description = description || '';
      str = str || '';
      return logger.info(`${description}: ${str}`);
    },

    e(description, str) {
      description = description || '';
      str = str || '';
      return console.error(`${description}: ${str}`);
    },

    logError(err) {
      logger.info(chalk.bgRed('Error ===>'));
      logger.info(err);
      logger.info(err.statusCode);
      return logger.info(err.message);
    },

    toBoolean(booleanStr) {
      if (booleanStr === null || booleanStr === undefined) return false;
      return booleanStr.toLowerCase() === 'true';
    },

    dump(obj) {
      return logger.info(util.inspect(obj, false, null));
    },

    include(array, str) {
      return !array.every((elem, idx, array) => str.indexOf(elem) === -1);
    },

    createParams(params) {
      return (() => {
        const result = [];
        for (const k in params) {
          const v = params[k];
          result.push(`${k}=${v}`);
        }
        return result;
      })().join('&');
    },
    // => 'key=apikey&code=01234&start=0&rows=0'

    deleyPromise(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // UNIXTIMEを返す
    // 引数なし -> 現在時刻のUNIXTIME
    // 引数あり -> 指定時刻のUNIXTIME
    formatX(time) {
      if (time != null) {
        return moment(time).format('X');
      }
      return moment().format('X');
    },

    formatYMD(time) {
      if (time != null) {
        return moment(new Date(time.toString())).format('YYYY-MM-DD');
      }
      return moment().format('YYYY-MM-DD');
    },

    formatYMDHms(time) {
      if (time != null) {
        return moment(new Date(time.toString())).format('YYYY-MM-DD HH:mm:ss');
      }
      return moment().format('YYYY-MM-DD HH:mm:ss');
    },

    // second秒後の時刻をYYYY-MM-DD HH:mm:ss　の形式で返す
    addSecondsFormatYMDHms(seconds, time) {
      if (time != null) {
        return moment(new Date(time)).add(seconds, 's').format('YYYY-MM-DD HH:mm:ss');
      }
      return moment().add(seconds, 's').format('YYYY-MM-DD HH:mm:ss');
    },

    // 進めた時刻をYYYY-MM-DD の形式で返す
    addTimeFormatYMD(type, amount, time) {
      if (type == null) {
        type = 'days';
      }
      if (amount == null) {
        amount = 0;
      }
      if (time != null) {
        return moment(new Date(time.toString())).add(amount, type).format('YYYY-MM-DD');
      }
      return moment().add(amount, type).format('YYYY-MM-DD');
    },

    /**
     * new Date()に数値を渡すと1970-~が返ってくるので要注意
     */
    // http://momentjs.com/docs/#/manipulating/start-of/
    startOf(time, type, format) {
      if (type == null) {
        type = 'day';
      }
      if (format == null) {
        format = 'YYYY-MM-DD';
      }
      if (time != null) {
        return moment(new Date(time.toString())).startOf(type).format(format);
      }
    },

    /**
     * new Date()に数値を渡すと1970-~が返ってくるので要注意
     */
    // http://momentjs.com/docs/#/manipulating/end-of/
    endOf(time, type, format) {
      if (type == null) {
        type = 'day';
      }
      if (format == null) {
        format = 'YYYY-MM-DD';
      }
      if (time != null) {
        return moment(new Date(time.toString())).endOf(type).format(format);
      }
    },

    // 引数の日の開始直後の時間をYYYY-MM-DD 00:00:00 の形式で返す
    rigthAfterStartingFormatYMDHms(time) {
      if (time != null) {
        return moment(`${time} 00:00:00`).format('YYYY-MM-DD HH:mm:ss');
      }
    },

    // 開始時刻と終了時刻が同じ日かどうか判定
    isSameDay(startTimeYMD, endTimeYMD) {
      if (startTimeYMD === endTimeYMD) {
        return true;
      }
      return false;
    },

    // ハッシュ化
    // 文字列長が64文字の文字列を生成
    createHash(key, algorithm = 'sha256') {
      return crypto.createHash(algorithm).update(key).digest('hex');
    },

    // 指定された文字列と生成したいサイズ数でユニークIDを生成
    // http://blog.fkei.me/2012/03/nodejs-uid.html
    createUID(size = 32, base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
      const len = base.length;
      const buf = [];
      let i = 0;

      while (i < size) {
        buf.push(base[Math.floor(Math.random() * len)]);
        ++i;
      }
      return buf.join('');
    },

    random(array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    randomByLimitNum(array, num) {
      let result = [];

      if (array.length < num) {
        result = [].concat(array);
        logger.info(`\
num =  ${num} array = ${array.length}, result = ${result.length}\
`);
        return result;
      }

      while (result.length < num) {
        const pluckedVal = this.random(array);
        if (_.contains(result, pluckedVal)) {
          continue;
        }
        result.push(pluckedVal);
      }
      // HACK: 上の2行は 下の1行でいいんじゃね？
      // result = _.uniq result
      return result;
    },

    // filename 'test.jpg'
    // targetPath 'logos'
    outputImage(base64Data, targetPath, fileName) {
      return new Promise((resolve, reject) => {
        logger.info(`${targetPath}/${fileName}`);
        const buff = new Buffer(base64Data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        return fs.writeFile(`${targetPath}/${fileName}`, buff, (err) => {
          if (err) {
            return reject(err);
          }
          return resolve('ok');
        });
      });
    },

    loadBase64Data(url) {
      return new Promise((resolve, reject) =>
        request(
          {
            url,
            headers: {
              'User-Agent': 'Magic Browser',
            },
            encoding: null,
          },
          (err, res, body) => {
            if (!err && res.statusCode === 200) {
              const base64prefix = `data:${res.headers['content-type']};base64,`;
              const image = body.toString('base64');
              return resolve(base64prefix + image);
            }
            return reject({
              statusCode: res.statusCode,
              statusMessage: res.statusMessage,
            });
          }
        )
      );
    },

    saveImage(url, opts) {
      return new Promise((resolve, reject) => {
        logger.info(url, opts);
        const ws = fs.createWriteStream(`${opts.targetPath}/${opts.filename}`);
        request(url, opts.requestParams).pipe(ws);
        ws.on('finish', () => resolve(url));
        return ws.on('error', (err) => {
          ws.end();
          return reject(err);
        });
      });
    },

    getFilesizeBite(url, opts) {
      return new Promise((resolve, reject) => {
        logger.info('getFilesizeBite ', url, opts);
        return request
          .get(url, opts.requestParams)
          .on('response', (response) => {
            if (response.statusCode !== 200) {
              return reject('image url is invalid');
            }
            return resolve(response.headers['content-length']);
          })
          .on('error', (err) => reject(err));
      });
    },
  };
};

exports.my = my();
