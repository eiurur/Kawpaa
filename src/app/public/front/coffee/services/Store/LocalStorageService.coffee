# Services
angular.module "myApp.services"
  .service "LocalStorageService", ->

    set: (key, value) ->
      localStorage.setItem key, value

    get: (key) ->
      localStorage.getItem key