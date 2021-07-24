angular.module "myApp.controllers"
  .controller "ViewCtrl", (
    $scope
    $routeParams
    $location
    AuthService
    PostManageService
    ) ->

  $scope.isLoaded = false
  $scope.user = AuthService.user