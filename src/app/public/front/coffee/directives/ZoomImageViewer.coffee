angular.module "myApp.directives"
  .directive 'zoomImageViewer', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="image-layer image-layer__overlay" ng-show="$ctrl.isShownLayer">
        <div class="image-layer__background" ng-click="$ctrl.close()" >
        </div>
        <div class="image-layer__container">
          <div class="image-layer__counter">
            <span>{{$ctrl.idx + 1}}</span>
            <span> / </span>
            <span>{{$ctrl.postListFlattened.length}}</span>
          </div>
          <img ng-show="$ctrl.post.type != 'video'" class="image-layer__img" ng-src="{{$ctrl.src}}" ng-click="$ctrl.close()" />
          <video id="video" ng-if="$ctrl.post.type == 'video'" controls="controls" autoplay="autoplay" muted="muted" loop="loop"">
            <source ng-src="data/videos/{{$ctrl.post.videos.original}}">
            Your browser does not support the video tag.
          </video>
          <div class="image-layer__caption"></div>
          <div class="image-layer__loading" ng-show="$ctrl.isShownLoading">
            <img src="./front/images/loaders/tail-spin.svg" />
          </div>
        </div>

        <div class="image-layer-control">
            <span class="image-layer__caption">
              <a class="original-link__anker" title="{{$ctrl.post.title}}" href="{{$ctrl.post.siteUrl}}" target="_blank">
              {{$ctrl.post.title}} : {{$ctrl.post.description}}
              </a>
            </span>
          <span class="clickable" ng-click="$ctrl.done()" ng-if="$ctrl.showDone">
            <i post-object-id="{{::postObjectId}}" class="fa fa-tint icon-tint"></i>
            Done
          </span>
          <span class="clickable" ng-click="$ctrl.addInbox()" ng-if="$ctrl.showAddInbox">
            <i post-object-id="{{::postObjectId}}" class="fa fa-inbox icon-inbox"></i>
            Inbox
          </span>
          <span class="clickable" ng-click="$ctrl.revertInbox()" ng-if="$ctrl.showRevertInbox">
            <i post-object-id="{{::postObjectId}}" class="fa fa-inbox icon-inbox"></i>
            Inbox
          </span>
          <span class="clickable" ng-click="$ctrl.archive()" ng-if="$ctrl.showArchive">
            <i post-object-id="{{::postObjectId}}" class="fa fa-check icon-check"></i>
            Archive
          </span>
          <span class="clickable" ng-click="$ctrl.increment()" ng-if="$ctrl.showIncrement">
            <i post-object-id="{{::postObjectId}}" class="fa fa-tint icon-tint"></i>
            Done
          </span>
          <span class="clickable" ng-click="$ctrl.favorite()" ng-if="$ctrl.showFavorite">
            <i post-object-id="{{::postObjectId}}" class="fa fa-heart icon-heart" ng-class="{'favorited': $ctrl.post.favorited}"></i>
            Favorite
          </span>
          <span class="clickable" ng-click="$ctrl.remove()" ng-if="$ctrl.showRemove">
            <i post-object-id="{{::postObjectId}}" type="{{::pageType}}" class="fa fa-trash icon-trash"></i>
            Remove
          </span>
          <span class="clickable" ng-click="$ctrl.close()">
            <i close="close" class="fa fa-remove"></i>
            Close
          </span>
        </div>

        <div class="image-layer__prev" ng-click="$ctrl.switchImage('prev')">
          <i class="fa fa-angle-left fa-2x feeding-arrow--left"></i>
        </div>
        <div class="image-layer__next" ng-click="$ctrl.switchImage('next')">
          <i class="fa fa-angle-right fa-2x feeding-arrow--right"></i>
        </div>
      </div>
    """
    bindToController: 
      posts: "="
      pageType: "="
    controller: ZoomImageViewerController
    controllerAs: "$ctrl"
    
class ZoomImageViewerController
  constructor: (@$scope, @$rootScope, @$swipe, @BrowserMeterService, @ImageSizeChecker, @ImageTransitionService, @PostManageService, @WindowScrollableSwitcher) ->
    @isShownLayer = false
    @isShownLoading = false
    @postListFlattened = []
    @idx = 0
    @currentAnglePosition = 0
    @layer = angular.element(document).find(@classNames.layer)
    @imgDom  = angular.element(document).find(@classNames.img)
    @container = angular.element(document).find('.image-layer__container')
    @loading = angular.element(document).find(@classNames.loading)
    @onSwiped = false
    @subscribe()

  classNames:
    'layer': '.image-layer'
    'img': '.image-layer__img'
    'loading': '.image-layer__loading'
    'overlay': 'image-layer__overlay'
    'widest': 'image-layer__img--max-width'
    'highest': 'image-layer__img--max-height'
    'horizontallyLong': "image-layer__img-horizontally-long"
    'verticallyLong': "image-layer__img-vertically-long"


  getPost: () ->
    if @postListFlattened[@idx]?.donePost?
      return @postListFlattened[@idx].donePost
    return @postListFlattened[@idx]

  getPostObjectId: ->
    @getPost()._id

  subscribe: ->
    @$scope.$on 'ZoomImageViewer::show', (event, args) => 
      console.log args
      @isShownLayer = true

      @WindowScrollableSwitcher.disableScrolling()
      @imgDom.hide()
      
      # /done/hisotryにおけるpostListのデータ構造が[[],[]]のようになっているため、他のページでのpostListと同じ扱いができるようフラットにする。
      @postListFlattened = _.flattenDeep(@posts)

      @idx = _.findIndex @postListFlattened, '_id': args._id
      @post = @getPost()
      
      if @post.type isnt 'video'
        @displayingImage = {
          width: @post.originImageWidth
          height: @post.originImageHeight
          from: args.toImgSrc
          to: args.imgSrc
        }
        @pipeLowToHighImage()
      else
        @loadVideo()
      @swicthDisplayingControl()
      @onKeyEvent()
      @onWheel()
      unless @onSwiped then @onSwipe()
      @$scope.$apply()

  onWheel: ->
    @layer
    .off 'wheel'
    .on 'wheel', (e) =>
      dir = if e.originalEvent.wheelDelta >= 0 then 'prev' else 'next'
      @switchImage dir

  # キーバインド
  # (ページごとに扱えるキー操作を個別にバインド)
  # TODO: ページのURLに応じて処理を変える(e.g. doneならremoveのpageTypeはdoneに変わり、削除対象も変わる。)
  # CAUTION: undefinedを付与しないと、removeAPIのurlが`/api/posts//564b70e0e2f0422811e2b1da`になって404が返ってくる
  onKeyEvent: ->
    console.log @pageType
    switch @pageType
      when 'archive'
        Mousetrap.bind 'd', => @done()
        Mousetrap.bind 'i', => @revertInbox()
        Mousetrap.bind 'o', => @openImageNewWindow()
        Mousetrap.bind 'r', => @remove()
      when 'done', 'favorite'
        Mousetrap.bind 'd', => @increment()
        Mousetrap.bind '+', => @increment()
        Mousetrap.bind 'f', => @favorite()
        Mousetrap.bind 'o', => @openImageNewWindow()
        Mousetrap.bind 'r', => @remove()
      when 'find', 'days', 'weeks', 'months', 'dashboard' # 厳しい
        Mousetrap.bind 'i', => @addInbox()
      when 'history'
        Mousetrap.bind 'd', => @done()
        Mousetrap.bind 'o', => @openImageNewWindow()
      else # inbox
        Mousetrap.bind 'a', => @archive()
        Mousetrap.bind 'd', => @done()
        Mousetrap.bind 'o', => @openImageNewWindow()
        Mousetrap.bind 'r', => @remove()

    # (共通)
    Mousetrap.bind ['left', 'k'], => @switchImage('prev')
    Mousetrap.bind ['right', 'j'], => @switchImage('next')
    Mousetrap.bind ['ctrl+left'], => @rotate(-1)
    Mousetrap.bind ['ctrl+right'], => @rotate(1)
    Mousetrap.bind ['esc', 'q'], => @close() && @$scope.$apply()
  
  onSwipe: ->
    @onSwiped = true
    startCoords = {}
    swipeStartTime = 0;
    swipeEndTime = 0;
    @$swipe.bind @container,
      'start': (coords, event) ->
        swipeStartTime = new Date().getTime();
        startCoords = coords
      'move': (coords, event) ->
        console.log 'move'
      'end': (coords, event) =>
        return if Math.abs(startCoords.y - coords.y) is 0
        swipeEndTime = new Date().getTime();
        diffTime = swipeEndTime - swipeStartTime
        diffX = startCoords.x - coords.x
        a = diffX / diffTime
        console.log(diffTime, diffX, a)
        if a > 0.1 # left-swipe
          @switchImage('next')
        else if a < -0.1 # マウス操作のとき、スワイプが発動し、再直下にスクロールしないようバッファを設けている
          @switchImage('prev')
        startCoords = {}
        @$scope.$apply()
      'cancel': (coords, event) =>
        console.log 'cancel'
        @close()

  unzoom: ->
    # removeClass()だと.img__layerも消されてしまい、transitionが無効化されるので個別にclassを削除
    @imgDom.removeClass(@classNames.horizontallyLong)
    @imgDom.removeClass(@classNames.verticallyLong)
    @imgDom.removeClass(@classNames.widest)
    @imgDom.removeClass(@classNames.highest)

  pipeLowToHighImage: () ->
    @isShownLoading = true
    @loading.show()
    @imgDom.hide()

    # 拡大画像の伸長方向の決定
    isVerticallyLong = @ImageSizeChecker.isVerticallyLong(@displayingImage, @imgDom, @html)
    @unzoom()
    if isVerticallyLong 
      @imgDom.addClass(@classNames.verticallyLong)
      @imgDom.addClass(@classNames.highest)
    else
      @imgDom.addClass(@classNames.horizontallyLong)
      @imgDom.addClass(@classNames.widest)

    @loading.hide()
    @imgDom.fadeIn(1)

    @imgDom.attr 'src', @displayingImage.from
    .on 'load', =>
      @imgDom.fadeIn(1)
      @imgDom.off 'load'
      @imgDom.attr 'src', @displayingImage.to
      .on 'load', =>
        @imgDom.fadeIn(1)
        @$scope.$apply()
  
  updownPostListIdx: (dir) ->
    @postListFlattened = _.flattenDeep(@posts)
    if dir is 'next'
      @idx = (@idx + 1) % @postListFlattened.length
    else if dir is 'prev'
      @idx = @idx - 1
      if @idx < 0 then @idx = @postListFlattened.length - 1
    else # 'active'
      @idx = @idx % @postListFlattened.length


  # 今見ているコンテンツが画面の中心にくるよう自動スクロールする。
  scrollToBrowsingPostPosition: ->
    # For history以外
    itemElement = angular.element(document).find(".item:eq(#{@idx})")

    # For history
    mediaElement = angular.element(document).find(".history__media:eq(#{@idx})")

    # For dashboard
    postElement = angular.element(document).find(".dashboard__post:eq(#{@idx})")

    # hack: 無理やり。。。
    element = do -> 
      if itemElement.length > 0 then return itemElement
      if mediaElement.length > 0 then return mediaElement
      if postElement.length > 0 then return postElement

    # 位置決め
    browser = @BrowserMeterService.getBrowserDimensions()
    top = element.offset().top
    bottom = top + element.outerHeight() / 2
    position = bottom - (browser.height / 2)

    # scrollイベントを復帰させないとscrollTopが動いてくれない。
    @WindowScrollableSwitcher.enableScrolling()

    # Chrome61からdocument.body.scrollTopが使えなくなった。代わりにscrollingElementを使用する。
    scrollNode = if document.scrollingElement then document.scrollingElement else document.body
    scrollNode.scrollTop = position
    
    @WindowScrollableSwitcher.disableScrolling()

  getFromImgAndToImg: ->
    from = "data/thumbnails/#{@post.images[@ImageTransitionService.zoomingPost.from]}"
    to = "data/images/#{@post.images[@ImageTransitionService.zoomingPost.to]}"
    return from: from, to: to

  switchImage: (direction) ->
    try
      @imgDom.hide()
      @imgDom.css('transform', "");
      @currentAnglePosition = 0
      @updownPostListIdx(direction)
      @post = @getPost()
      @scrollToBrowsingPostPosition()
      if @post.type isnt 'video'
        img = @getFromImgAndToImg()
        @displayingImage = {
          width: @post.originImageWidth
          height: @post.originImageHeight
          from: img.from
          to: img.to
        }
        @pipeLowToHighImage()
      else 
        @loadVideo()
    catch e
      # 最後の一枚を何らかのアクションで除外されたとき、など
      console.log e
      @close()
  getRotationDegrees: (obj) ->
    matrix = obj.css('-webkit-transform') or obj.css('-moz-transform') or obj.css('-ms-transform') or obj.css('-o-transform') or obj.css('transform')
    if matrix != 'none'
      values = matrix.split('(')[1].split(')')[0].split(',')
      a = values[0]
      b = values[1]
      angle = Math.round(Math.atan2(b, a) * 180 / Math.PI)
    else
      angle = 0
    angle

  rotate: (angle = 0) ->
    @currentAnglePosition += angle
    angle = @currentAnglePosition * 90
    @imgDom.css('transform', "rotate(#{angle}deg)");

  loadVideo: ->
    return if @post.type isnt 'video'
    @isShownLoading = true
    @loading.show()
    @unzoom()
    if @$scope.$root.$$phase != '$apply' && @$scope.$root.$$phase != '$digest'
      @$scope.$apply()
    video = document.querySelector('#video')
    if video 
      video.load() 
      @loading.hide()

  excludePost: ->
    @posts.splice @idx, 1
    @switchImage('active')


  openImageNewWindow: ->
    postObjectId = @getPostObjectId()
    size = "width=#{screen.availWidth},height=#{screen.availHeight}"
    window.open "/post/#{@pageType}/#{postObjectId}", '', size


  addInbox: ->
    params =
      postObjectId: @getPostObjectId()
    @excludePost()
    @PostManageService.addInbox params
    .then (data) -> console.log data
    .catch (err) -> console.log err

  revertInbox: ->
    params =
      postObjectId: @getPostObjectId()
    @excludePost()
    @PostManageService.revertInbox params
    .then (data) -> console.log data
    .catch (err) -> console.log err

  archive: ->
    params =
      postObjectId: @getPostObjectId()
    @excludePost()
    @PostManageService.archive params
    .then (data) -> console.log data
    .catch (err) -> console.log err

  # キー押下が早すぎると同じ画像を重複登録してしまうので初めにリストから抜いておく。
  # hisotryページとDoneページでは抜いたPostを非表示にしない
  done: ->
    params =
      postObjectId: @getPostObjectId()
    unless !_.isUndefined(@postListFlattened[@idx].donePost) and @postListFlattened[@idx].donePost?
      @excludePost()
    @PostManageService.done params
    .then (data) -> console.log data
    .catch (err) -> console.log err

  increment: ->
    params =
      postObjectId: @getPostObjectId()
      numDone: @post.numDone
      type: 'increase'
    @PostManageService.flucate params
    .then (variationNum) => @post.numDone += variationNum
    .catch (err) -> console.log err

  favorite: ->
    params =
      postObjectId: @getPostObjectId()
    method = if @post.favorited then @PostManageService.unfavorite params else @PostManageService.favorite params
    method
    .then (data) => @post.favorited = !@post.favorited
    .catch (err) -> console.log err

  remove: ->
    params =
      postObjectId: @getPostObjectId()
      type: @pageType
    return unless window.confirm("削除してもよろしいですか？")
    @excludePost()
    @PostManageService.remove params
    .then (data) -> console.log data
    .catch (err) -> console.log err

  close: -> @cleanup()

  swicthDisplayingControl: ->
    console.log(@pageType)
    [
      @showAddInbox, 
      @showRevertInbox, 
      @showArchive, 
      @showDone, 
      @showIncrement, 
      @showFavorite, 
      @showUnfavorite, 
      @showRemove
    ] = do =>
      switch @pageType.toLowerCase()
        when 'find', 'dashboard'
          return [true, false, false, false, false, false, false, false]
        when 'inbox','null'
          return [false, false, true, true, false, false, false, true]
        when 'archive'
          return [false, true, false, true, false, false, false, true]
        when 'done', 'favorite'
          return [false, false, false, false, true, true, true, true]
        else
          return [false, false, false, false, false, false, false, false]

  cleanup: ->
    @isShownLayer = false
    Mousetrap.unbind ['left', 'right', 'ctrl+left', 'ctrl+right', 'esc', 'a', 'd', 'f', 'i', 'j', 'k', 'n', 'o', 'q', 'r', 'z', '+', '-']
    @imgDom.unbind 'mousedown mousemove mouseup touchstart touchmove touchend touchcancel'
    @WindowScrollableSwitcher.enableScrolling() 

ZoomImageViewerController.$inject = ['$scope', '$rootScope', '$swipe', 'BrowserMeterService', 'ImageSizeChecker', 'ImageTransitionService', 'PostManageService', 'WindowScrollableSwitcher']