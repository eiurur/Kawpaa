angular.module "myApp.directives"
  .directive "imgPreload", ->
    restrict: "A"
    link: (scope, element, attrs) ->
      element
      .on "load", -> element.addClass "in"
      .on "error", -> return
