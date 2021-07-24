angular.module "myApp.directives"
  .directive 'statsCounterContainer', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="row">
        <div ng-repeat="item in $ctrl.items" class="col-md-4">
          <stats-counter class="counter__container" type="{{item.type}}" count="{{item.count}}" icon="1"></stats-counter>
        <div>
      </div>
    """
    bindToController: {}
    controller: statsCounterContainer
    controllerAs: "$ctrl"

class statsCounterContainer
  constructor: (@$scope, @StatsService, @PromiseService) ->
    @items = []
    @types = ['inbox', 'archive', 'done']
    @setCounterDataset()
  
  setCounterDataset: ->
    @fetchCounts()
    .then (responses, index) =>
      responses.map (response, index) => 
        @items.push
          type: @types[index]
          count: response.data.count
    .catch (err) -> console.log err
    
  fetchCounts: ->
    tasks = @types.map (type) => @PromiseService.get("/api/posts/#{type}/count") 
    @PromiseService.all(tasks)

statsCounterContainer.$inject = ['$scope', 'StatsService', 'PromiseService']