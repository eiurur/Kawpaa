angular.module "myApp.directives"
  .directive 'multiPostContainer', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="post__wrapper">
        <section>
          <div class="scroll-content col-md-12 col-xl-12">
            <div class="post__side-menu">
              <i class="fa fa-2x fa-pause fa-border" ng-show="$ctrl.autoScrollLevel == 0" ng-click="$ctrl.toggleAutoScroll()"></i>
              <i class="fa fa-2x fa-angle-down fa-border" ng-show="$ctrl.autoScrollLevel == 1" ng-click="$ctrl.toggleAutoScroll()"></i>
              <i class="fa fa-2x fa-angle-double-down fa-border" ng-show="$ctrl.autoScrollLevel == 2" ng-click="$ctrl.toggleAutoScroll()"></i>
              <i class="fa fa-2x fa-forward fa-rotate-90 fa-border" ng-show="$ctrl.autoScrollLevel == 3" ng-click="$ctrl.toggleAutoScroll()"></i>
            </div>

            <div class="post__controls">
              <div class="selectable-buttons">
                <span class="button button--active" ng-click="$ctrl.changeColumns(1)" data-columns="1">1列</span>
                <span class="button" ng-click="$ctrl.changeColumns(2)" data-columns="2">2列</span>
                <span class="button" ng-click="$ctrl.changeColumns(3)" data-columns="3">3列</span>
                <span class="button" ng-click="$ctrl.changeColumns(4)" data-columns="4">4列</span>
              </div>
              <div class="switchable-button">
                <div class="form-group">
                  <div class="input-group"><span class="input-group-addon"><i class="fa fa-sort"></i></span>
                    <select ng-model="$ctrl.sortTypeList.selected" ng-options="l.k for l in $ctrl.sortTypeList.items track by l.k">
                    </select>
                  </div>
                </div>
              </div>
              <div class='post__control--container'>
                <div class='post__control'>
                  <i ng-click="$ctrl.done()" class="fa__size--sm clickable fa fa-tint icon-tint"></i>
                </div>
              </div>
            </div>
            <div class="row row-eq-height">
              <div class="multi" data-index="{{$index}}" ng-repeat="post in $ctrl.posts" ng-if="$ctrl.posts.length != 0" ng-class="$ctrl.grid">
                <div class="post">
                  <!-- postContainerからコピペ (onRotateImageが不要)-->
                  <!-- width:100%を当てると左寄りになる -->
                  <!-- PostFactoryを通していないのでfromImgSrc, toImgSrcは空。なのでサイズを直接指定 -->
                  <div ng-if="post.type == 'image'" class="w100 post__img__container">
                    <img
                      ng-src="data/thumbnails/{{post.images.medium}}"
                      id="{{post._id}}"
                      to-img-src="data/images/{{::post.images.original}}"
                      img-src="data/images/{{::post.images.original}}"
                      id="{{::post._id}}"
                      post="post"
                      zoom-image=zoom-image
                      pipe-low-to-high-image="pipe-low-to-high-image"
                    />
                  </div>
                  <!-- width:100%にしないと動画の表示域が狭まる -->
                  <div ng-if="post.type == 'link'" class="w100">
                    <div ng-bind-html="post.content | trustedHtml" class="w100"></div>
                  </div>
                  <!-- width:100%にしないと動画の表示域が狭まる -->
                  <div ng-if="post.type == 'video'" class="w100">
                    <video poster="{{post.src}}" controls="controls" autoplay="autoplay" muted="muted" loop="loop" style="width:100%">
                      <source ng-src="data/videos/{{post.videos.original}}">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div ng-if="$ctrl.type == 'text'" class="w100 post__text__container">
                    <div ng-bind-html="post.content | trustedHtml" style="width:100%"></div>
                  </div>
                  <!-- コピペ ここまで -->
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    """
    bindToController: {}
    controller: MultiPostContainerController
    controllerAs: "$ctrl"

class MultiPostContainerController
  constructor: (@$location, @$routeParams, @$scope, @$sce,  @ConstantsService, @PostManageService) ->
    params = @$location.search() 
    @params = params.images || params.links || params.videos ||  params.texts
    @posts = []
    @autoScrollLevel = 0
    @columns = 1
    @grid = {
      'col-xs-12': true
    }
    @sort = 'asc'
    @init()
    @bindKeyAction()
    @setConditionList()
    @onChangeCondition()

    @$scope.$on '$destroy', => @unbindKeyAction()

  init: ->
    @params.split(',').map( (postObjectId) => @addPost(postObjectId))

  bindKeyAction: ->
    Mousetrap.bind 'd', => @done()

  unbindKeyAction: ->
    Mousetrap.unbind ['d']

  setConditionList: ->
    sortTypeListItems = _.filter @ConstantsService.SORT_TYPE_LIST.items, (item) -> return item.t is 'all'
    @sortTypeList =
      items: sortTypeListItems
      selected: @ConstantsService.SORT_TYPE_LIST.selected

  onChangeCondition: ->
    @$scope.$watch angular.bind(this, ->
      @sortTypeList.selected
    ), (newData, oldData) =>
      return if newData is oldData
      if(/update/.test(newData.v))
        sort = if newData.v.includes('Desc') then -1 else 1
        @posts = @posts.sort (a, b) => if new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime() then sort else -sort
      else if (/create/.test(newData.v))
        sort = if newData.v.includes('Desc') then -1 else 1
        @posts = @posts.sort (a, b) => if new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() then sort else -sort 
      return

  # REFACTORING: コピペ
  addPost: (postObjectId) ->
    return unless postObjectId
    opts =
      pageType: @$routeParams.pageType
      postObjectId: postObjectId
    @PostManageService.findByObjectId(opts)
    .then (response) => 
      @posts.push(response.data)
      console.log @posts
      @posts.sort (a, b) => if new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() then -1 else 1 # 作成日で降順ソート

  changeColumns: (columns) ->
    console.log columns
    colNum = 12 / columns
    @grid = {}
    @grid["col-md-#{colNum}"] = true
    @grid["col-lg-#{colNum}"] = true
    @grid["col-xs-#{colNum}"] = true
    buttons = angular.element('.selectable-buttons').find('.button')
    angular.forEach buttons, (element) ->
      ele = angular.element(element)
      ele.removeClass('button--active')
      if ele.data('columns') is columns then ele.addClass('button--active')

  # REFACTORING: コピペ
  done: ->
    # 表示中の順番のまま保存されるようにする
    posts = @posts.reverse().map (post) => postObjectId: post.postObjectId 
    @PostManageService.doneMulti posts: posts
    .then (result) -> open(location, '_self').close()
    .catch (err) -> console.log err

  isBottom: ->
    d = document.documentElement
    offset = d.scrollTop + window.innerHeight
    wrapper = document.querySelector('.scroll-content')
    height = wrapper.offsetHeight
    return offset >= height

  isElementOutViewport: (el) ->
    rect = el.getBoundingClientRect()
    wrapper = document.querySelector('.scroll-content')
    return rect.bottom < 0 || rect.top > window.innerHeight

  toggleAutoScroll: ->
    @autoScrollLevel = (@autoScrollLevel + 1) % 4
    clearInterval(@scroll)
    if @autoScrollLevel is  3
      @scroll = setInterval((=>
        elements = Array.from(document.querySelectorAll('.multi'))
        active = document.querySelector('.multi.active')
        start = if !!active then (active.getAttribute('data-index') - 0 ) else 0

        elements.map (el) -> el.classList.remove('active')
        for i in [start..elements.length]
          if elements.length - 1 is i 
            window.scrollTo(0, elements[0].offsetTop)
            elements[0].classList.add("active")
            break
          else if !@isElementOutViewport(elements[i])
            nextElement = elements[i].nextElementSibling
            window.scrollTo(0, nextElement.offsetTop)
            nextElement.classList.add("active")
            break
      ), 5 * 1000)
    else if @autoScrollLevel > 0
      offset = 4 * @autoScrollLevel
      @scroll = setInterval((=>
        window.scrollBy 0, offset
        if @isBottom() then window.scrollTo(0,0)
        return
      ), 100)
    else 
      clearInterval(@scroll)

MultiPostContainerController.$inject =  ['$location', '$routeParams', '$scope', '$sce', 'ConstantsService', 'PostManageService']