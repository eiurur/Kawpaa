angular.module "myApp.directives"
  .directive 'unearthTermChanger', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="unearth-term-changer">
        <div class="selectable-buttons">
          <span class="button button--active" ng-click="$ctrl.change(12)" data-amount="12">1年前</span>
          <span class="button" ng-click="$ctrl.change(24)" data-amount="24">2年前</span>
          <span class="button" ng-click="$ctrl.change(36)" data-amount="36">3年前</span>
          <span class="button" ng-click="$ctrl.change(48)" data-amount="48">4年前</span>
          <span class="button" ng-click="$ctrl.change(60)" data-amount="60">5年前</span>
          <span class="button" ng-click="$ctrl.change(72)" data-amount="72">6年前</span>
        </div>
      </div>
    """
    bindToController:
      term: "="
    controller: UnearthTermChangerController
    controllerAs: "$ctrl"

class UnearthTermChangerController
  constructor: (@$scope) ->

  change: (amount) ->
    buttons = angular.element('.unearth-term-changer .selectable-buttons').find('.button')
    angular.forEach buttons, (element) ->
      ele = angular.element(element)
      ele.removeClass('button--active')
      if ele.data('amount') is amount then ele.addClass('button--active')
    @$scope.$emit 'unearthTermChanger::change', amount: amount

UnearthTermChangerController.$inject = ['$scope']