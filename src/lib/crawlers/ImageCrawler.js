const chalk = require('chalk');
const moment = require('moment');
const path = require('path');

const { DIRECTORIES } = require(path.resolve('build', 'lib', 'constants'));
const TimeManager = require(path.resolve('build', 'lib', 'utils', 'TimeManager'));
const { PostRepository, ImageRepository } = require(path.resolve('build', 'model', 'repository'));

const FindImageCollection = require('./FindImageCollection');
const FindPostCollection = require('./FindPostCollection');
const FindCategoryPost = require('./FindCategoryPost');

module.exports = class ImageCrawler {
  constructor({ name, term, options = {} }) {
    this.name = name;
    this.hostname = name;
    this.term = term;
    this.options = options;
    this.illusts = [];
    this.preprocess();
  }

  preprocess() {
    this.changeDateToOneBefore();
  }

  setCrawler(Crawler) {
    const initial = { term: this.term, date: this.date };
    this.crawler = new Crawler(initial);
  }

  changeDateToOneBefore() {
    if (this.term === 'weeks') {
      // week の更新は月曜日なので、月曜日に前日の週刊ランキングをクローリングすればいい。最適解法がまだ見つからない。
      this.date = TimeManager.changeDate({ term: 'days', date: moment(), amount: -1 });
    } else {
      this.date = TimeManager.changeDate({ term: this.term, date: moment(), amount: -1 });
    }
  }

  async exec() {
    console.log(chalk.yellow(`${this.name}: ${this.term} => date = ${this.date}`));
    const illusts = await this.crawler.download({
      directory: DIRECTORIES.IMAGES_TO,
      amount: 0,
      options: this.options,
    });
    console.log(chalk.green('Done download illusts'));

    const findImageCollection = new FindImageCollection({ illusts });
    findImageCollection.rejectNonTargetImage();
    await findImageCollection.generateThumnail();
    const images = findImageCollection.getThumbnails();
    console.log(chalk.cyan('Done Sosyaku.bite()'));

    const findPostCollection = new FindPostCollection({ illusts, images });
    await findPostCollection.mergeAll();
    const mergedPosts = findPostCollection.getPosts();
    const result = await this.save(mergedPosts);
    console.log(chalk.blue('Done save2DB'));

    return result;
  }

  /**
   *
   * @param {*} illusts
   */
  async save(illusts) {
    const saveToDatabaseTasks = illusts.map(async (illust) => {
      const images = await this.upsertImage(illust.image);
      const findCategoryPost = this.getFindCategoryPost({ illust, images });
      const post = await this.upsertPost(findCategoryPost);
      return post; // CAUTION: post -> DBに保存され_idつきのpostデータ
    });
    return Promise.all(saveToDatabaseTasks);
  }

  /**
   *
   * @param {*} illust
   * @param {*} images
   */
  getFindCategoryPost({ illust, images }) {
    return new FindCategoryPost({
      name: this.name,
      term: this.term,
      date: this.date,
      illust,
      images,
    });
  }

  /**
   *
   * @param {*} image
   * @return {*} images - DBに保存された_idつきのimagesデータ
   */
  async upsertImage(image) {
    const imageRepository = new ImageRepository();
    imageRepository.setImage(image);
    return await imageRepository.__findOneAndUpdate();
  }

  /**
   *
   * @param {*} findCategoryPost
   * @return {*} post - DBに保存された_idつきのpostデータ
   */
  async upsertPost(findCategoryPost) {
    const postRepository = new PostRepository();
    postRepository.setPost(findCategoryPost);
    return await postRepository.__upsert();
  }
};
