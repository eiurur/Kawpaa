angular.module "myApp.services"
  .service "KawpaaStoreService", ->
    store: {}
    set: (key, value) -> @store[key] = value
    get: (key) -> @store[key]
