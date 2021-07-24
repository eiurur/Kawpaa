angular.module "myApp.controllers"
  .controller "MenuCtrl", (
    $scope
    ) ->
  $scope.isToggleMenu = false

  $scope.toggle = ->
    $scope.isToggleMenu = !$scope.isToggleMenu

  $scope.overlay = ->
    if $scope.isToggleMenu
      $scope.isToggleMenu = false