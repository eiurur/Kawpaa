angular.module "myApp.controllers"
  .controller "PostListCtrl", (
    $scope
    $q
    Post
    RandomPost
    AuthService
    URLParameterService
    PostManageService 
    KawpaaStoreService
    KawpaaLocalStorageService
    TimeService
    ArrayService
    ) ->

  # searchbox のみ
  $scope.$on 'SearchBox::search', (event, args) ->
    console.log 'SearchBox::search on', args
    condition = Object.assign({}, KawpaaStoreService.get('condition'), args)
    KawpaaStoreService.set('condition', condition)
    getPost(KawpaaLocalStorageService.get('userObjectId'), condition)
    return

  $scope.$on 'SearchCondition::change', (event, args) ->
    console.log 'SearchCondition::change on', args
    condition = Object.assign({}, KawpaaStoreService.get('condition'), args)
    getPost(KawpaaLocalStorageService.get('userObjectId'), condition)
    return

  $scope.$watch 'random', (newValue, oldValue) -> 
    return if !newValue && !oldValue
    $scope.$emit 'SearchBox::random'
    condition = KawpaaStoreService.get('condition')
    getPost(KawpaaLocalStorageService.get('userObjectId'), condition)
    return

  $scope.$on '$destroy', (event, args) ->
    console.log '=======> on desctory PostListCtrl', args
    $scope.postList = null

  getPost = (userObjectId, opts) ->
    $scope.searchWord = opts?.searchWord || ''
    $scope.during = opts?.during?.v or $scope.during
    $scope.filterType = opts?.filterType?.v or $scope.filterType
    $scope.sortType = opts?.sortType?.v or $scope.sortType
    $scope.random = opts?.random?.v or $scope.random

    if $scope.random then post = new RandomPost(userObjectId, $scope.pageType, $scope.filterType, $scope.sortType, $scope.searchWord, $scope.during)
    else post = new Post(userObjectId, $scope.pageType, $scope.filterType, $scope.sortType, $scope.searchWord, $scope.during)
    $scope.postList = post
    $scope.postList.nextPage()

  getUnearths = () ->
    amounts = TimeService.agos().map (i) -> i * 12
    type = $scope.pageType
    promises = amounts.map (amount) -> PostManageService.findUnearth(type: type, amount: amount)
    $q.all promises
    .then (responseList) ->
      $scope.unearths = amounts.map (amount, index) -> 
        if ['favorite', 'done'].includes(type)
          items = responseList[index].data.map (post) -> post.donePost
        else 
          items = responseList[index].data
        return
          ago: index + 1
          amount: amount
          items: items
          random: ArrayService.takeRandom(items)

  params = URLParameterService.getParameters('main')
  $scope.pageType = params.pageType or 'null'
  $scope.user = AuthService.user
  setTimeout ()->
    getUnearths()
  , 100