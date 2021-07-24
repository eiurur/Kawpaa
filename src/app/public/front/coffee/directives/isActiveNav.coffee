angular.module "myApp.directives"
  .directive 'isActiveNav', ($location) ->
    restrict: 'A'
    link: (scope, element) ->
      scope.location = $location
      scope.$watch 'location.path()', (currentPath) ->
        if currentPath is element[0].attributes['href'].nodeValue
          element.addClass 'active'
        else
          element.removeClass 'active'
        return