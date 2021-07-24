const _ = require('lodash');
const path = require('path');

const { logger } = require(path.resolve('logger'));

const { DonePostProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class DonePostRepository extends DonePostProvider {
  constructor(donePost) {
    if (donePost == null) {
      donePost = {};
    }
    super(...arguments);
    this.donePost = donePost;
    this.increaseNum = 1; // 後で修正。というか消す。
  }

  setPostObjectId(postObjectId) {
    return (this.postObjectId = postObjectId);
  }

  getPostObjectId() {
    return this.postObjectId;
  }

  setDonePost(donePost) {
    return (this.donePost = donePost);
  }

  getDonePost() {
    return this.donePost;
  }

  setOriginPostedBy(originPostedBy) {
    return (this.donePost.originPostedBy = originPostedBy);
  }

  setNumDone(numDone) {
    return (this.donePost.numDone = numDone);
  }

  setIncreaseNum(increaseNum) {
    return (this.increaseNum = increaseNum);
  }

  deleteObjectId() {
    return delete this.donePost._id;
  }

  done(newDonePostData) {
    logger.info('donePostデータは存在するか？ => ', !_.isEmpty(newDonePostData) && !_.isNull(newDonePostData), newDonePostData);

    // 投稿データが重複していたら更新
    if (!_.isEmpty(newDonePostData) && !_.isNull(newDonePostData)) {
      this.setIncreaseNum(1);
      return this.upsert({ donePost: newDonePostData }).then((result) => this.__flucateNumDone());
    }

    // 既に抜いてあるなら数を増やすだけ
    this.deleteObjectId();
    this.setNumDone(1);
    return this.__save();
  }

  __findById(user) {
    return this.findById({ postObjectId: this.postObjectId, userObjectId: user._id });
  }

  __findByUrlAndSiteUrlAndPostedBy(post) {
    return this.findByUrlAndSiteUrlAndPostedBy({
      url: post.url,
      siteUrl: post.siteUrl,
      userObjectId: post.postedBy,
    });
  }

  __save() {
    return this.save({ donePost: this.donePost });
  }

  __findByIdAndUpdate() {
    return this.findByIdAndUpdate({ donePost: this.donePost });
  }

  __remove() {
    return this.remove({ postObjectId: this.postObjectId });
  }

  __flucateNumDone() {
    return this.flucateNumDone({ donePost: this.donePost, increaseNum: this.increaseNum });
  }
};
