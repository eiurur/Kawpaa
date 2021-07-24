angular.module "myApp.services"
  .service "RecommendService", (PromiseService) ->
    find: (params) ->
      url = "/api/recommends"
      PromiseService.get url
