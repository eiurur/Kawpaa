# Directives
angular.module "myApp.directives"
  .directive "changeImgWideDirection", ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      toggle = ->
        className = element.attr('class')
        if className 
          element.removeClass(className)
        else
          if element[0].naturalWidth > element[0].naturalHeight 
            element.addClass(widthWideClass) 
          else 
            element.addClass(heightWideClass)

      widthWideClass = 'width--wide'
      heightWideClass = 'height--wide'
      element.on 'click', -> toggle()
