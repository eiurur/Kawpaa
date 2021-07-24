const path = require('path');

const { PostProvider } = require(path.resolve('build', 'model', 'provider'));

module.exports = class PostRepository extends PostProvider {
  constructor(postObjectId, post) {
    if (postObjectId == null) {
      postObjectId = null;
    }
    if (post == null) {
      post = {};
    }
    super(...arguments);
    this.postObjectId = postObjectId;
    this.post = post;
  }

  // Controller(クライアントサイド)から渡されるPostモデルの_id
  setPostObjectId(postObjectId) {
    return (this.postObjectId = postObjectId);
  }

  setPost(post) {
    return (this.post = post);
  }

  getPost() {
    return this.post;
  }

  __findById() {
    return this.findById({ postObjectId: this.postObjectId }); // FIXME: userObjectId: user._idを渡したい
  }

  __remove() {
    return this.remove({ postObjectId: this.postObjectId });
  }

  __upsert() {
    const userObjectId = this.post.postedBy === null ? null : this.post.postedBy;
    return this.upsert({ post: this.post, userObjectId });
  }

  // シェルスクリプト用
  __upsertWithoutRenewUpdatedAt() {
    const userObjectId = this.post.postedBy === null ? null : this.post.postedBy;
    return this.upsertWithoutRenewUpdatedAt({ post: this.post, userObjectId });
  }

  __upsertById(user) {
    return this.upsertById({ post: this.post, userObjectId: user._id });
  }
};
