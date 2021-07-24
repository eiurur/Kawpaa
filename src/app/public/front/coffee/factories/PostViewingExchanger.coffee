# angular.module "myApp.factories"
#   .factory 'PostViewingExchanger', (NotifyService) ->
#     class PostViewingExchanger

#       # @type [String] archive, fav, done
#       constructor: (@$scope) ->
#         @subscribe()
#         @unsubscribe()

#       subscribe: ->
#         Mousetrap.bind ['s s'], =>
#           return if @$scope.sortTypeList.items.length < 2
#           currentIdx = @$scope.sortTypeList.items.indexOf @$scope.sortTypeList.selected
#           nextIdx = currentIdx + 1
#           idx = if nextIdx is @$scope.sortTypeList.items.length then 0 else nextIdx
#           @$scope.sortTypeList.selected = @$scope.sortTypeList.items[idx]
#           NotifyService.infomation("ソート順を「#{@$scope.sortTypeList.selected.k}」に切り替えました")
#           return

#         Mousetrap.bind ['t t'], =>
#           return if @$scope.filterTypeList.items.length < 2
#           currentIdx = @$scope.filterTypeList.items.indexOf @$scope.filterTypeList.selected
#           nextIdx = currentIdx + 1
#           idx = if nextIdx is @$scope.filterTypeList.items.length then 0 else nextIdx
#           @$scope.filterTypeList.selected = @$scope.filterTypeList.items[idx]
#           NotifyService.infomation("フィルタの種類を「#{@$scope.filterTypeList.selected.k}」に切り替えました")
#           return

#       unsubscribe: ->
#         @$scope.$on '$destroy', ->
#           console.log 'PostListCtrl $destroy'
#           Mousetrap.unbind ['s s', 't t']

#     PostViewingExchanger
