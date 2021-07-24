angular.module "myApp.directives"
  .directive 'statsRankingContainer', ->
    restrict: 'E'
    scope: {}
    template: """
    <div class="stats__message" ng-if='$ctrl.heads.length == 0'>
      no data ...
    </div>
    <div class="years__container" ng-if='$ctrl.heads.length > 0'>
      <div class="years">
        <div ng-repeat="head in $ctrl.heads" class="years__item">
          <a class="inherit-link" href="/stats/ranking/{{head.year}}">
          <div class="years__overlay"></div>
        </a>
          <section class="years__text">
            <div class="year">
              <div>{{head.year}}年</div>
            </div>
          </section>
          <img
            ng-src="data/images/{{::head.post.images.original}}"
            id="{{::head.post._id}}"
            class="item__image years__image"/>
        <div>
      </div>
    </div>
    """
    bindToController:
      year: '='
    controller: StatsRankingContainerController
    controllerAs: "$ctrl"

class StatsRankingContainerController
  constructor: (@$scope, @StatsService, @YearlyBestPost) ->
    @set()

  set: ->
    # TODO: 抜いた年数を取得
    @StatsService.heads()
    .then (result) =>
      # years =  @StatsService.terms() 
      unless result.data?.heads? then return 
      heads = result.data.heads
      @heads = heads.map (head) => 
        year: head.date
        post: JSON.parse(head.item)
        count: head.count
      console.log(@heads)
    .catch (err) =>
      console.log err

StatsRankingContainerController.$inject = ['$scope', 'StatsService', 'YearlyBestPost']