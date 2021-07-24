angular.module "myApp.directives"
  .directive "initializeImgWideDirection", ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      # 縦長の画像だと縦に入りきらず毎回クリックを強いられていたので自動化。横はきれいに収まるので処理不要。
      heightWideClass = 'height--wide'
      className = element.attr('class')

      # DOMの読み込みが完了しないとwidth, heightが0
      element.on 'load', (e) =>
        if element[0].naturalWidth > element[0].naturalHeight 
          element.removeClass(className)
        else
          element.addClass(heightWideClass)
        scope.$apply()
