angular.module "myApp.services"
  .service "StatsService", (PromiseService) ->
    terms: ->
      LAUNCHED_YEAR = 2015 # サービス開始年
      currentYear = (new Date()).getFullYear()
      [LAUNCHED_YEAR...currentYear].reverse()

    findHostnameAggregation: (params) ->
      url = "/api/stats/hostname/list"
      PromiseService.get url

    heads: (params) ->
      url = "/api/stats/ranking/heads"
      PromiseService.get url

    findByYear: (params) ->
      url = "/api/stats/ranking/#{params.year}"
      PromiseService.get url
