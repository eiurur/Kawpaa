module.exports = class Delayer {
  static delayPromise(ms) {
    return new Promise((resolve => setTimeout(resolve, ms)));
  }
};
