angular.module "myApp.directives"
  .directive 'itemBorder', ($location) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      className = "item__content--#{attrs.type}"
      element.addClass className
