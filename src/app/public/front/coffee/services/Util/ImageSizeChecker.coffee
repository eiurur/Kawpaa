angular.module "myApp.services"
  .service 'ImageSizeChecker', ->
    # NOTE: image = myApp.factories.Image x_x < 型が欲しい
    isVerticallyLong: (image, imgDOM, htmlDOM) ->
      htmlDOM = htmlDOM or angular.element(document).find('html')

      if image.width and image.height
        w = image.width
        h = image.height
      else # DBに画像のサイズ情報がない場合は、読みこんだ画像からサイズを取得
        h = imgDOM[0].naturalHeight
        w = imgDOM[0].naturalWidth

      h_w_percent = h / w * 100

      cH = htmlDOM[0].clientHeight
      cW = htmlDOM[0].clientWidth
      cH_cW_percent = cH / cW * 100

      return h_w_percent - cH_cW_percent >= 0