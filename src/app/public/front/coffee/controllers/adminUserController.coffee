angular.module "myApp.controllers"
  .controller "AdminUserCtrl", (
    $scope
    $location
    AuthService
    KawpaaLocalStorageService
    ) ->

  $scope.isReady = false
  $scope.isAuthenticated = AuthService.status.isAuthenticated

  # ログイン済みで、別ページからの遷移
  # if $scope.isAuthenticated
  if AuthService.status.isAuthenticated
    $scope.isReady = true
    return

  AuthService.fetchSession()
  .then (response) ->
    console.log response.data

    AuthService.status.isAuthenticated = true
    AuthService.user = response.data
    KawpaaLocalStorageService.set 'userObjectId', response.data.userObjectId
    KawpaaLocalStorageService.set 'twitterIdStr', AuthService.user.twitterIdStr

    $scope.user = response.data
    $scope.isAuthenticated = true
    $scope.isReady = true
  .catch (err) ->
    new WOW().init() # IndexCntrlのなかで実行しても反応がないのでここで実行
    $scope.isAuthenticated = false
    $scope.isReady = true
    $location.path '/'
    return