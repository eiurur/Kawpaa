angular.module "myApp.controllers"
  .controller "UnearthCtrl", (
    $scope
    $q
    $timeout
    Post
    PostManageService
    TimeService
    URLParameterService 
    ) ->

  categories = ['inbox', 'archive', 'done', 'favorite']

  $scope.$on 'unearthTypeChangerController::change', (event, args) ->
    setPageType(args.type)
    URLParameterService.clearHash()
    getUnearths(args.hash)

  $scope.$on '$destroy', (event, args) ->
    $scope.unearths = null
    return

  moveToTop = (hash) -> 
    if hash
      $timeout((->
        target = document.getElementById(hash)
        target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" })
      ), 1000)
    else
      window.scrollTo
        top: 0
        behavior: 'smooth'
      
  mergeCategoryProperty = (category, posts, ago) ->
    post = new Post(null, category)
    if ['favorite', 'done'].includes(category)
      postsMergedCategory = posts.map (p) -> Object.assign(category: category, ago: ago, p.donePost)
    else
      postsMergedCategory = posts.map (p) -> Object.assign(category: category, ago: ago, p)
    post.addPost(postsMergedCategory)
    post

  getUnearths = (hash) ->
    type = $scope.pageType
    amounts = TimeService.agos().map (i) -> i * 12
    promises = amounts.map (amount) -> PostManageService.findUnearth(type: type, amount: amount)
    $q.all promises
    .then (responseList) ->
      $scope.hasAnyPost = responseList.some (response) => response.data.length > 0
      $scope.unearths = {items: amounts.map((amount, index) -> mergeCategoryProperty(type, responseList[index].data, index + 1).items).filter((items) -> items.length > 0)}
      setPostList()
      $scope.ready = true
      moveToTop(hash)

  setPostList = () ->
    type = $scope.pageType
    items = []
    posts = _.flattenDeep($scope.unearths.items)
    for item, index in posts
      pre = if index > 0 then posts[index-1] else null
      items.push(Object.assign(item, {pre: pre}))
    $scope.postList = {items: items}

  setPageType = (pageType) ->
    $scope.pageType = (categories.find (category) -> category is pageType) ||  'archive'
    URLParameterService.setQueryString({pageType: $scope.pageType})

  {pageType} = URLParameterService.getQueryString()
  hash = URLParameterService.getHash()
  $scope.unearths = null
  $scope.ready = false

  pageType = if pageType is 'null' then 'inbox' else pageType
  setPageType(pageType)
  getUnearths(hash)