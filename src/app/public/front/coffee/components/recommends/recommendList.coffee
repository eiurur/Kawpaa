angular.module "myApp.directives"
  .directive 'recommendList', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="recommend" data-title="{{item.title}}" ng-repeat='item in $ctrl.items' ng-if="$ctrl.items.length != 0" >
        <a title="{{item.title}}" href="{{item.source}}" target="_blank">
          <img  ng-src="{{item.images.large}}" alt="" border="0" class="target_type">
        </a>
      </div>
    """
    bindToController: {}
    controller: RecommendList
    controllerAs: "$ctrl"

class RecommendList
  constructor: (@$scope, @RecommendService) ->
    @items = []
    @set()

  set: ->
    @RecommendService.find()
    .then (response) => @items = response.data
    .catch (err) -> console.log err

RecommendList.$inject = ['$scope', 'RecommendService']