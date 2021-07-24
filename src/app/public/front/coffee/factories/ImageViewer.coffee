angular.module "myApp.factories"
  .factory 'ImageViewer', (ImageSizeChecker) ->
    class ImageViewer
      @containerHTML: """
      <div class="image-layer image-layer__overlay">
        <div class="image-layer__container">
          <img class="image-layer__img"/>
          <div class="image-layer__caption"></div>
          <div class="image-layer__loading">
            <img src="./front/images/loaders/tail-spin.svg" />
          </div>
          <image-layer-control class="image-layer-control"></image-layer-control>
          <div class="image-layer__prev">
            <i class="fa fa-angle-left fa-2x feeding-arrow--left"></i>
          </div>
          <div class="image-layer__next">
            <i class="fa fa-angle-right fa-2x feeding-arrow--right"></i>
          </div>
        </div>
      </div>
      """

      @classNames =
        'img': '.image-layer__img'
        'caption': '.image-layer__caption'
        'loading': '.image-layer__loading'
        'widest': 'image-layer__img--max-width'
        'highest': 'image-layer__img--max-height'
        'horizontallyLong': "image-layer__img-horizontally-long"
        'verticallyLong': "image-layer__img-vertically-long"

      constructor: ->
        @body = angular.element(document).find('body')
        @body.append ImageViewer.containerHTML
        @layer = angular.element(document).find('.image-layer')
        @imgDom  = angular.element(document).find(ImageViewer.classNames.img)
        @loading = angular.element(document).find(ImageViewer.classNames.loading)


      unzoom: ->
        # removeClass()だと.img__layerも消されてしまい、transitionが無効化されるので個別にclassを削除
        @imgDom.removeClass(ImageViewer.classNames.horizontallyLong)
        @imgDom.removeClass(ImageViewer.classNames.verticallyLong)
        @imgDom.removeClass(ImageViewer.classNames.widest)
        @imgDom.removeClass(ImageViewer.classNames.highest)

      pipeLowToHighImage: (image) ->
        @image = image
        @loading.show()
        @imgDom.hide()
 
        # 拡大画像の伸長方向の決定
        isVerticallyLong = ImageSizeChecker.isVerticallyLong(@image, @imgDom, @body)
        @unzoom()
        if isVerticallyLong 
          @imgDom.addClass(ImageViewer.classNames.verticallyLong)
          @imgDom.addClass(ImageViewer.classNames.highest)
        else
          @imgDom.addClass(ImageViewer.classNames.horizontallyLong)
          @imgDom.addClass(ImageViewer.classNames.widest)

        @imgDom.attr 'src', image.from
        .on 'load', =>
          @loading.hide()
          @imgDom.fadeIn(1)

          # loadの∞ループ回避
          @imgDom.off 'load'

          @imgDom.attr 'src', image.to
          .on 'load', =>
            @imgDom.fadeIn(1)

      cleanup: ->
        @imgDom.unbind 'mousedown mousemove mouseup touchstart touchmove touchend touchcancel'
        @layer.remove()

    ImageViewer