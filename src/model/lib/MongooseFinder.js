module.exports = class MongooseFinder {
  constructor({ model, options, fields, limit, skip, sort, populates }) {
    this.model = model;
    this.options = options;
    this.fields = fields;
    this.limit = limit;
    this.skip = skip;
    this.sort = sort;
    this.populates = populates;
  }

  /**
   *
   * @param {*} query
   */
  buildQuery(query) {
    if (this.sort) {
      query = query.sort(this.sort);
    }

    if (this.limit) {
      query = query.limit(this.limit);
    }

    if (this.skip) {
      query = query.skip(this.skip);
    }

    if (this.populates) {
      // 理想： this.populates.forEach(populate => query = query.populate(populate));
      query = this.buildPopulate(query);
    }

    return query;
  }

  buildPopulate(query) {
    this.populates.forEach((populate) => {
      if (typeof populate === 'string' || populate instanceof String) {
        query = query.populate(populate);
      } else if (Array.isArray(populate)) {
        query = query.populate(populate[0], populate[1]);
      } else if (populate instanceof Object && populate.constructor === Object) {
        query = query.populate(populate);
      }
    });
    return query;
  }

  /**
   *
   */
  findOne() {
    return new Promise((resolve, reject) => {
      this.buildQuery(this.model.findOne(this.options, this.fields)).exec((err, result) => (err ? reject(err) : resolve(result)));
    });
  }

  /**
   *
   */
  find() {
    return new Promise((resolve, reject) => {
      this.buildQuery(this.model.find(this.options, this.fields)).exec((err, result) => (err ? reject(err) : resolve(result)));
    });
  }
};
