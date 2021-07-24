angular.module "myApp.directives"
  .directive 'tagRegistrationBar', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="tag-registration-bar" ng-show="$ctrl.isShow" ng-class="{'tag-registration-bar--show': $ctrl.isShow}">
        <form class="tag-registration-form">
          <div class="form-group tag-registration-bar__search-form">
            <textarea class="form-control tag-register"></textarea>
          </div>
          <div class="form-group tag-list__container">
            <span class="tag-list">
            </span>
          </div>
          <div class="form-group tag-registration-bar__register">
            <button class="btn btn-outline-info" on-click="$ctrl.register()">登録</button>
          </div>
        </form>
      </div>
    """
    bindToController:
      postList: "="
      pageType: "="
    controller: TagRegistrationBarController
    controllerAs: "$ctrl"

class TagRegistrationBarController
  constructor: (@$scope, @$rootScope, @ItemSelectionService) ->
    @isShow = false
    @onDestroy()
    @subscribe()

  register: ->
    tags = [] # TODO: inputタグからタグ情報を取得する
    items = @ItemSelectionService.registerTag(tags)

  close: ->
    @isShow = false

  onDestroy: -> 
    @$scope.$on '$destroy', => @close()

  subscribe: ->
    @$scope.$on 'multiSelect::show', (event, args) => 
      @isShow = true
      @$scope.$apply()

    @$scope.$on 'multiSelect::hide', (event, args) => 
      @isShow = false

    onUnSelect = @$rootScope.$on 'multiSelect::unselect', (event, args) => 
      @isShow = false

    @$scope.$on('$destroy', onUnSelect)

    @$rootScope.$on 'SearchCondition::change', (event, args) => @close()

TagRegistrationBarController.$inject = ['$scope', '$rootScope', 'ItemSelectionService']