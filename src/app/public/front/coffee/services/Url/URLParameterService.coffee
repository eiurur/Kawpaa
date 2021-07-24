# Services
angular.module "myApp.services"
  .service "URLParameterService", ($location, $window, $httpParamSerializer) ->

    checkURLResourceLength: (urlResourcesLength, allowableLength) -> if urlResourcesLength > allowableLength then $location.path('/')

    getQueryString: -> 
      $location.search()
    
    setQueryString: (params) ->
      $location.search(params).replace()

    hasQueryString: ->
      @getQueryString().length isnt 0
    
    getHash: ->
      hash = $location.hash()
      return hash

    clearHash: ->
        path = $location.path() + '?' + $httpParamSerializer($location.search())
        $window.history.replaceState('', document.title, path) 

    parse: -> 
      $location.path().split('/')

    getType: ->
    
    getParameters: (page) ->
      params = this.parse()
      if page is 'main'
        pageType = params[1]
      else if page is 'post'
        pageType = params[2]
        postObjectId = params[3]
      else if page is 'donePairs'
        pageType = params[2]
        postObjectId = _.last params
      return {
        pageType: pageType
        postObjectId: postObjectId
      }


    redirectHomeIfExceptionUrl: (allowableLength) ->
      this.checkURLResourceLength(@parse().length, allowableLength)