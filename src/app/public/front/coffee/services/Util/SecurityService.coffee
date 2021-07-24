angular.module "myApp.services"
  .service "SecurityService", ($sce) ->
    trustAsResourcUrl: (url) ->
      $sce.trustAsResourceUrl(url)