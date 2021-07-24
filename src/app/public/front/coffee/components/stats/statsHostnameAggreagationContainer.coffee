angular.module "myApp.directives"
  .directive 'statsHostnameAggregationContainer', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="stats__hostname__container">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>hostname</th>
              <th>回数</th>
            </tr>
          </thead>
          <tbody ng-repeat="item in $ctrl.items | limitTo:30", ng-if="$ctrl.items.length != 0">
            <tr>
              <td>{{item._id}}</td>
              <td>{{item.sum}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    """
    bindToController: {}
    controller: StatsHostnameAggregationContainer
    controllerAs: "$ctrl"

class StatsHostnameAggregationContainer
  constructor: (@$scope, @StatsService) ->
    @items = []
    @set()

  set: ->
    @StatsService.findHostnameAggregation()
    .then (response) => @items = response.data.ranking
    .catch (err) -> console.log err

StatsHostnameAggregationContainer.$inject = ['$scope', 'StatsService']