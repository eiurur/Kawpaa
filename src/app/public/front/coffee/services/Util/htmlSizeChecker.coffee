# 未使用
angular.module "myApp.services"
  .service 'htmlSizeChecker', ->
    isVerticallyLong: (htmlDOM) ->
      htmlDOM = htmlDOM or angular.element(document).find('html')
      cH = htmlDOM[0].clientHeight
      cW = htmlDOM[0].clientWidth
      return cH - cW >= 0