angular.module "myApp.controllers"
  .controller "PostCtrl", (
    $scope
    $routeParams
    AuthService
    URLParameterService
    PostManageService
    ) ->

  console.log 'postObjectId = ', $routeParams.postObjectId
  console.log 'type = ', $routeParams.type
  console.log 'type = ', $routeParams.pageType

  $scope.isLoaded     = false
  $scope.pageType     = $routeParams.pageType
  $scope.postObjectId = $routeParams.postObjectId
  $scope.user         = AuthService.user

  URLParameterService.redirectHomeIfExceptionUrl(4)
  {pageType: pageType, postObjectId: postObjectId} = URLParameterService.getParameters('post')
  opts =
    pageType: pageType
    postObjectId: postObjectId
  console.log 'opts => ', opts
  PostManageService.findByObjectId(opts)
  .then (response) -> $scope.post = response.data