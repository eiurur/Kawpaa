angular.module "myApp.services"
  .service "RequestService", ($http) ->
    post: (url, payload, opts = {}) ->
      $http.post url, payload, opts

    get: (url, opts = {}) ->
      $http.get url, opts

    put: (url, payload, opts = {}) ->
      $http.put url, payload, opts

    delete: (url) ->
      $http url: url, method: "DELETE"