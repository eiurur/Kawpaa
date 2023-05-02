angular.module "myApp.controllers"
  .controller "LoginCtrl", (
    $scope
    $route
    AuthService
    NotifyService
    ) ->
  $scope.email = ""
  $scope.password = ""
  $scope.token = ""

  $scope.loginWithEmail = () ->
    data = {
      email: $scope.email,
      password: $scope.password,
    }
    console.log(data)
    AuthService.loginWithEmail(data)
    .then (response) ->
      location.reload(true)
    .catch (err) ->
      NotifyService.error(err.toString())
      
  $scope.loginWithToken = () ->
    data = {
      token:  $scope.token,
      password: "dummy", # keyがなかったりvalueがnullだとBadRequestになるのでダミーを渡す
    }
    AuthService.loginWithToken(data)
    .then (response) ->
      location.reload(true)
    .catch (err) ->
      NotifyService.error("Failed login.")
