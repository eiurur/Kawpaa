angular.module "myApp.controllers"
  .controller "FindCtrl", (
    $location
    $scope
    $routeParams
    PopularPost
    AuthService
    TimeService
    URLParameterService
    ) ->

  convertTerm = (term) ->
    return term.slice(0, -1) # days -> day, weeks -> week, months -> month

  getPost = (newQueryParams) ->
    $scope.date = TimeService.normalizeDate $routeParams.term, newQueryParams.date
    $scope.postList = new PopularPost($routeParams.term, $scope.date)
    $scope.postList.nextPage()

  $scope.$on 'termPagination::paginate', (event, args) ->
    console.log 'termPagination::paginate on', args
    $location.search 'date', args.date
    getPost(args)
    return

  $scope.$on '$destroy', (event, args) ->
    console.log '=======> on desctory FindCtrl', args
    $scope.postList = null
    

  URLParameterService.redirectHomeIfExceptionUrl(5)
  qs = URLParameterService.getQueryString()
  params = URLParameterService.getParameters('main')
  $scope.pageType = params.pageType or 'null'

  # デフォルトは前日
  # CAUTION momentに渡すtermはsがない。
  uniTerm = convertTerm($routeParams.term) # days -> day, weeks -> week, months -> month
  if _.isEmpty(qs) then qs.date = moment().subtract(1, uniTerm).format('YYYY-MM-DD')
  console.log qs

  $scope.term = $routeParams.term
  $scope.user = AuthService.user
  getPost(qs)
