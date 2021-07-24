angular.module "myApp.services"
  .service "TagManageService", ($q, NotifyService, PromiseService,  RequestService) ->
    register: (params) ->
      return $q (resolve, reject) ->
        RequestService.put "/api/tag/#{params.postObjectId}", tags: params.tags
        .then (response) ->
          NotifyService.success 'タグを追加しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText
