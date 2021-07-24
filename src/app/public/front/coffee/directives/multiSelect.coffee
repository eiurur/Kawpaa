# Directives
angular.module "myApp.directives"
  .directive "multiSelect", ($rootScope, ItemSelectionService) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      item = { postObjectId: attrs.postObjectId }

      unMultiSelect = $rootScope.$on 'multiSelect::multiselect', (event, args) => 
        return if !Array.isArray(args.items) or args.items.length is 0

        find = args.items.find (_item) -> _item._id is item.postObjectId
        return unless find

        item = {postObjectId: find._id}
        return if ItemSelectionService.has(item)

        ItemSelectionService.add(item)
        cover = angular.element('<div class="item__selected">')
        cover.attr('data-number', ItemSelectionService.count())
        element.prepend(cover)

      onUnSelect = $rootScope.$on 'multiSelect::unselect', (event, args) => 
        ItemSelectionService.delete(item)
        cover = element[0].querySelector('.item__selected')
        angular.element(cover).remove()

      scope.$on('$destroy', unMultiSelect)
      scope.$on('$destroy', onUnSelect)

      element.on 'click', (e) ->
        if !(e.ctrlKey || e.shiftKey) && ItemSelectionService.isEmpty()
          return 

        if e.ctrlKey && e.shiftKey
          $rootScope.$broadcast('multiSelect::rangeSelect', item: item)
        else
          if ItemSelectionService.has(item)
            ItemSelectionService.delete(item)
            cover = element[0].querySelector('.item__selected')
            angular.element(cover).remove()
            ItemSelectionService.list().map (item, i) -> 
              angular.element('[post-object-id="' + item.postObjectId + '"] > .item__selected').attr('data-number', i + 1)
          else
            ItemSelectionService.add(item)
            cover = angular.element('<div class="item__selected">')
            cover.attr('data-number', ItemSelectionService.count())
            element.prepend(cover)

        if ItemSelectionService.isEmpty()
          $rootScope.$broadcast('multiSelect::hide')
        else
          $rootScope.$broadcast('multiSelect::show')
        scope.$apply()
