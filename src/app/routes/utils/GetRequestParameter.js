/*
Expressのreqを一つにまとめる
*/
module.exports = class GetRequestParameter {
  static parse(req) {
    return Object.assign({}, req.query, req.params, req.body, { user: req.user });
  }
};
