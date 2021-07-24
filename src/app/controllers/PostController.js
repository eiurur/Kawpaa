const path = require('path');

const { seaquencer } = require(path.resolve('build', 'app', 'routes', 'utils', 'seaquencer'));
const { PostService, PostRegisterService } = require(path.resolve('build', 'app', 'services'));

module.exports = class PostController {
  static toInbox(req, res) {
    return seaquencer(req, res, PostService.toInbox(req.params.type, req.params));
  }

  static update(req, res) {
    return seaquencer(req, res, PostService.upsertById(req.params));
  }

  static register(req, res) {
    return seaquencer(req, res, PostRegisterService.register(req.params));
  }

  static find(req, res) {
    const condition = PostService.Condition(req.params);
    return seaquencer(req, res, PostService.find(req.params.type, condition));
  }

  static findById(req, res) {
    const condition = {
      postObjectId: req.params.postObjectId,
      userObjectId: req.params.user._id,
    };
    return seaquencer(req, res, PostService.findOne(req.params.type, condition));
  }

  static findRelativeImages(req, res) {
    const condition = PostService.Condition(req.params);
    return seaquencer(req, res, PostService.findRelativeImages(req.params.type, condition));
  }

  /**
   * ポストの前後1件ずつをnext property, prev propertyとして追加したオブジェクトを返す。
   * 前後のポストがない場合は値にnullを格納して返す
   * @param {*} req
   * @param {*} res
   */
  static findByIdBeforeAndAfter(req, res) {
    const condition = {
      userObjectId: req.params.user._id,
      postObjectId: req.params.postObjectId,
    };
    return seaquencer(req, res, PostService.findByIdBeforeAndAfter(req.params.type, condition));
  }

  static retrieve(req, res) {
    const condition = PostService.Condition(req.params);
    return seaquencer(req, res, PostService().find(req.params.type, condition));
  }

  static count(req, res) {
    const condition = PostService.Condition(req.params);
    return seaquencer(req, res, PostService.count(req.params.type, condition));
  }

  static countAll(req, res) {
    const condition = {};
    return seaquencer(req, res, PostService.countAll(req.params.type, condition));
  }

  static delete(req, res) {
    return seaquencer(req, res, PostService.remove(req.params.type, req.params));
  }
};
