angular.module "myApp.directives"
  .directive 'unearthTypeChanger', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="unearth-type-changer">
        <div class="selectable-buttons">
          <span class="button" ng-click="$ctrl.change('inbox')" data-type="inbox">Inbox</span>
          <span class="button" ng-click="$ctrl.change('archive')" data-type="archive">Archive</span>
          <span class="button" ng-click="$ctrl.change('done')" data-type="done">Done</span>
          <span class="button" ng-click="$ctrl.change('favorite')" data-type="favorite">Favorite</span>
        </div>
      </div>
    """
    bindToController: {}
    controller: UnearthTypeChangerController
    controllerAs: "$ctrl"

class UnearthTypeChangerController
  constructor: (@$scope, @URLParameterService) ->
    {pageType} = @URLParameterService.getQueryString()
    @activate(pageType)

  activate: (type) ->
    buttons = angular.element('.unearth-type-changer .selectable-buttons').find('.button')
    angular.forEach buttons, (element) ->
      ele = angular.element(element)
      ele.removeClass('button--active')
      if ele.data('type') is type then ele.addClass('button--active')

  change: (type) ->
    @activate(type)
    @$scope.$emit 'unearthTypeChangerController::change', type: type

UnearthTypeChangerController.$inject = ['$scope', 'URLParameterService']