angular.module "myApp.directives"
  .directive 'imageLayerControl', ->
    restrict: 'E'
    scope: false
    template: """
      <div class="image-layer-control">
        <span>
          {{$ctrl.ItemSelectionService.count()}} 件を選択しています
        </span>
        <span class="clickable" ng-click="$ctrl.addInbox()" ng-if="$ctrl.showAddInbox">
          <i post-object-id="{{::postObjectId}}" class="fa fa-inbox icon-inbox"></i>
          Inbox
        </span>
        <span class="clickable" ng-click="$ctrl.revertInbox()" ng-if="$ctrl.showRevertInbox">
          <i post-object-id="{{::postObjectId}}" class="fa fa-inbox icon-inbox"></i>
          Inbox
        </span>
        <span class="clickable" ng-click="$ctrl.archive()" ng-if="$ctrl.showArchive">
          <i post-object-id="{{::postObjectId}}" class="fa fa-check icon-check"></i>
          Archive
        </span>
        <span class="clickable" ng-click="$ctrl.done()" ng-if="$ctrl.showDone">
          <i post-object-id="{{::postObjectId}}" class="fa fa-tint icon-tint"></i>
          Done
        </span>
        <span class="clickable" ng-click="$ctrl.increment()" ng-if="$ctrl.showIncrement">
          <i post-object-id="{{::postObjectId}}" class="fa fa-tint icon-tint"></i>
          Done
        </span>
        <span class="clickable" ng-click="$ctrl.favorite()" ng-if="$ctrl.showFavorite">
          <i post-object-id="{{::postObjectId}}" class="fa fa-heart icon-heart"></i>
          Favorite
        </span>
        <span class="clickable" ng-click="$ctrl.unfavorite()" ng-if="$ctrl.showUnfavorite">
          <i post-object-id="{{::postObjectId}}" class="fa fa-heart-o"></i>
          UnFavorite
        </span>
        <span class="clickable" ng-click="$ctrl.remove()" ng-if="$ctrl.showRemove">
          <i post-object-id="{{::postObjectId}}" type="{{::pageType}}" class="fa fa-trash icon-trash"></i>
          Remove
        </span>
        <span class="clickable" ng-click="$ctrl.close()">
          <i close="close" class="fa fa-remove"></i>
          Close
        </span>
      </div>
    """
    bindToController: 
      posts: "="
      pageType: "="
    controller: ImageLayerControl
    controllerAs: "$ctrl"

class ImageLayerControl
  constructor: (@$scope, @$rootScope, @ItemSelectionService) ->
    @isShow = false
    @onDestroy()
    @subscribe()

  addInbox: ->
    items = @ItemSelectionService.addInbox()
    @hideItemFromList(items)
    @close()

  revertInbox: ->
    items = @ItemSelectionService.revertInbox()
    @hideItemFromList(items)
    @close()

  archive: ->
    items = @ItemSelectionService.archive()
    @hideItemFromList(items)
    @close()

  done: ->
    items = @ItemSelectionService.done()
    @hideItemFromList(items)
    @close()

  increment: ->
    items = @ItemSelectionService.done()
    @posts.items.forEach (post) => items.forEach (item) -> if item.postObjectId is post._id then post.numDone++
    @close()

  favorite: ->
    items = @ItemSelectionService.favorite()
    @posts.items.forEach (post) => items.forEach (item) -> if item.postObjectId is post._id then post.favorited = true
    @close()

  unfavorite: ->
    items = @ItemSelectionService.unfavorite()
    @posts.items.forEach (post) => items.forEach (item) -> if item.postObjectId is post._id then post.favorited = false
    @close()
    
  remove: ->
    return unless window.confirm("削除してもよろしいですか？")
    items = @ItemSelectionService.remove({type: @pageType})
    @hideItemFromList(items)
    @close()

  hideItemFromList: (items) ->
    @posts.items = @posts.items.filter (post) => items.every (item) -> item.postObjectId isnt post._id

  close: ->
    @isShow = false
    @ItemSelectionService.clear()
    Mousetrap.unbind ['esc', 'q']
    @$scope.$emit 'multiSelect::unselect'

  onDestroy: -> 
    @$scope.$on '$destroy', => @close()

  onKeyCommand: ->
    Mousetrap.bind ['esc', 'q'], => @close() && @$scope.$apply()

  subscribe: ->
    @$scope.$on 'ImageLayerControl::show', (event, args) => 
      @swicthDisplayingControl()
      @onKeyCommand()
      @isShow = true

    @$scope.$on 'ImageLayerControl::hide', (event, args) => 
      @isShow = false

    @$scope.$on 'ImageLayerControl::rangeSelect', (event, args) => 
      items = @ItemSelectionService.listRange(args.item, @posts)
      @$scope.$emit 'multiSelect::multiselect', items: items

    @$rootScope.$on 'SearchCondition::change', (event, args) => @close()


  swicthDisplayingControl: ->
    console.log(@pageType)
    [
      @showAddInbox, 
      @showRevertInbox, 
      @showArchive, 
      @showDone, 
      @showIncrement, 
      @showFavorite, 
      @showUnfavorite, 
      @showRemove
    ] = do =>
      switch @pageType.toLowerCase()
        when 'find'
          return [true, false, false, false, false, false, false, false]
        when 'inbox','null'
          return [false, false, true, true, false, false, false, true]
        when 'archive'
          return [false, true, false, true, false, false, false, true]
        when 'done', 'favorite'
          return [false, false, false, false, true, true, true, true]
        else
          return [false, false, false, false, false, false, false, false]

ImageLayerControl.$inject = ['$scope', '$rootScope', 'ItemSelectionService']