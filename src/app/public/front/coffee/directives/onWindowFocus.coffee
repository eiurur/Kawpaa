angular.module "myApp.directives"
  .directive 'onWindowFocus', ($rootScope, $window) ->
    restrict: 'A'
    link: (scope, element) ->
       $window.onfocus = ->
        console.log ' $windows onfocus'
        $rootScope.$broadcast 'onWindowFocus::onfocus', true
        return

       $window.onblur = ->
        console.log ' $windows onblur'
        $rootScope.$broadcast 'onWindowFocus::onblur', true
        return

