angular.module "myApp.services"
  .service "PromiseService", ($q, RequestService) ->
    post: (url, payload, opts = {}) ->
      return $q (resolve, reject) ->
        RequestService.post url, payload, opts
        .then (response) -> resolve response
        .catch (err) -> reject err

    get: (url, opts = {}) ->
      return $q (resolve, reject) ->
        RequestService.get url, opts
        .then (response) -> resolve response
        .catch (err) -> reject err

    put: (url, payload, opts = {}) ->
      return $q (resolve, reject) ->
        RequestService.put url, payload, opts
        .then (response) -> resolve response
        .catch (err) -> reject err

    delete: (url) ->
      return $q (resolve, reject) ->
        RequestService.delete url
        .then (response) -> resolve response
        .catch (err) -> reject err
    
    all: (tasks) ->
      return $q.all(tasks)