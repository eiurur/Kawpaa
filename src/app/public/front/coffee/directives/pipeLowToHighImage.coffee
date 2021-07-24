# todo: 配列で渡された画像URLを読み込みが終わり次第差し替えていく
angular.module "myApp.directives"
  .directive 'pipeLowToHighImage', ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.addClass 'filter'
      toImg = new Image()
      toImg.onload = ->
        element.attr 'src', attrs.toImgSrc
        element.removeClass 'filter'
        scope.$apply()
        toImg = null

      toImg.onerror = ->
        console.log 'Failed toImg'
        element.attr 'src', './front/images/loaders/puff.svg' # Loaderを表示。(TODO: 一極化)
        element.removeClass 'filter'
        scope.$apply()
        toImg = null
        
      toImg.src = attrs.toImgSrc
