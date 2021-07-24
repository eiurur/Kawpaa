# 画像拡大機能のみ
angular.module "myApp.directives"
  .directive "zoomImage", (ImageTransitionService, ImageViewer) ->
    restrict: 'A'
    scope:
      post: '='
    link: (scope, element, attrs) ->
      element.on 'click', ->
        getPost = ->
          if scope.post.donePost?
            return scope.post.donePost
          return scope.post

        getPostObjectId = ->
          if scope.post.donePost?
            return scope.post.donePost._id
          return scope.post._id

        post = getPost()
        image = 
          width: post.originImageWidth
          height: post.originImageHeight
          from: attrs.toImgSrc
          to: attrs.imgSrc

        imageViewer = new ImageViewer()
        imageViewer.pipeLowToHighImage(image)

        # オーバーレイ部分をクリックしたら生成した要素は全て削除する
        imageLayerContainer = angular.element(document).find('.image-layer__container')
        imageLayerContainer.on 'click', -> cleanup()
        Mousetrap.bind ['esc', 'q'], -> cleanup()

        getFromImgAndToImg = ->
          post = getPost()
          from = "data/thumbnails/#{post.images[ImageTransitionService.zoomingPost.from]}"
          to = "data/images/#{post.images[ImageTransitionService.zoomingPost.to]}"
          return from: from, to: to

        cleanup = ->
          Mousetrap.unbind ['esc', 'q']
          imageViewer.cleanup()
          imageViewer = null
          imageLayerContainer.remove()