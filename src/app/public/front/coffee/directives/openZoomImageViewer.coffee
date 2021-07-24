angular.module "myApp.directives"
  .directive "openZoomImageViewer", ($rootScope, ItemSelectionService) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'click', (e) ->
        return if e.ctrlKey || e.shiftKey || ItemSelectionService.isSelected()

        $rootScope.$broadcast 'ZoomImageViewer::show', _id: attrs.id, toImgSrc: attrs.toImgSrc, imgSrc: attrs.imgSrc
        return
