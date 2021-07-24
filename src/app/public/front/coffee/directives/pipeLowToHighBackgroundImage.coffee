# angular.module "myApp.directives"

#   # todo: 配列で渡された画像URLを読み込みが終わり次第差し替えていく
#   .directive 'pipeLowToHighBackgroundImage', ->
#     restrict: 'A'
#     link: (scope, element, attrs) ->

#       fromImg = new Image()
#       fromImg.src = attrs.fromImgSrc
#       fromImg.onload = ->
#         element.css 'background-image', "url('#{attrs.fromImgSrc}')"
#         element.addClass 'filter'
#         scope.$apply()
#         fromImg = null

#         toImg = new Image()
#         toImg.src = attrs.toImgSrc
#         toImg.onload = ->
#           element.css 'background-image', "url('#{attrs.toImgSrc}')"
#           element.removeClass 'filter'
#           scope.$apply()
#           toImg = null

#         toImg.onerror = ->
#           console.log 'Failed toImg'
#           element.removeClass 'filter'
#           scope.$apply()
#           toImg = null