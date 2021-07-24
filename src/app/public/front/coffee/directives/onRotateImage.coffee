# Directives
angular.module "myApp.directives"
  .directive "onRotateImage", ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      degreeRotate = 0
      Mousetrap.bind ['ctrl+left'], -> element.css('transform', "rotate(#{degreeRotate -= 90}deg)")
      Mousetrap.bind ['ctrl+right'], -> element.css('transform', "rotate(#{degreeRotate += 90}deg)")

