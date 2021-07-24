angular.module "myApp.controllers"
  .controller "DoneHistoryCtrl", (
    $scope
    $location
    HistoryPost
    TimeService
    AuthService
    ) ->

  getPost = (param = {}) ->
    $scope.date = TimeService.normalizeDate null, param.date
    $scope.postList = new HistoryPost(AuthService.user.userObjectId, $scope.date)
    $scope.postList.nextPage()
    return 

  $scope.$on 'doneHistoryCtrl::focusDate', (event, args) ->
    console.log 'DoneHistoryCtrl::focusDate on', args
    getPost(args)
    return

  $scope.$on '$destroy', (event, args) ->
    console.log '=======> on desctory DoneHistoryCtrl', args
    $scope.postList = null
    
  $scope.user = AuthService.user
  $scope.pageType = 'history'
  $scope.isReady = true
  getPost()
