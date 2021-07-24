
angular.module "myApp.directives"
  .directive 'allCountContainer', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="section-title">
              射精状況
            </div>
            <hr class="section-line">
          </div>
          <div class="col-md-12">
            <div class="col-md-6 count-1">
              <h1>溜まったオカズ</h1>
              <span class="count-list__count">{{$ctrl.post}}</span>
            </div>
            <div class="col-md-6 count-3">
              <h1>使ったオカズ</h1>
              <span class="count-list__count">{{$ctrl.doneHistory}}</span>
            </div>
          </div>
        </div>
      </div>
    """
    bindToController: {}
    controller: allCounterContainer
    controllerAs: "$ctrl"

class allCounterContainer
  constructor: (@$scope, @PromiseService) ->
    @types = ['inbox', 'archive',  'donehistory']
    @setCounterDataset()
  
  setCounterDataset: ->
    @fetchCounts()
    .then (responses, index) =>
      @post = responses[0].data.count + responses[1].data.count # inbox + archiove
      @doneHistory = responses[2].data.count
    .catch (err) -> console.log err

  fetchCounts: ->
    tasks = @types.map (type) => @PromiseService.get("/api/posts/#{type}/count/all") 
    @PromiseService.all(tasks)

allCounterContainer.$inject = ['$scope', 'PromiseService']