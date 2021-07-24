angular.module "myApp.services"
  .service "TermPeginateDataServicve", ($rootScope) ->
    publish: (params) ->
      $rootScope.$broadcast 'TermPeginateDataServicve::publish', params