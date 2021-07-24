angular.module "myApp.factories"
  .factory 'URLParameterChecker', (URLParameterService) ->
    class URLParameterChecker
      constructor: ->
        @urlResources = URLParameterService.parse()
        @queryParams = URLParameterService.getQueryString()
      
      checkURLResourceLength: (allowableLength) ->
        URLParameterService.checkURLResourceLength(@urlResources.length, allowableLength)
