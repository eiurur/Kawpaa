angular.module "myApp.directives"
  .directive 'statsYearAggregationContainer', ->
    restrict: 'E'
    scope: {}
    template: """
    <div class="row best__container">

      <span ng-if="$ctrl.ranking.isLast && $ctrl.ranking.items.length == 0">
        <h1>{{$ctrl.year}}年のオカズデータが存在しないため、集計できません。</h1>
      </span>

      <span ng-if="$ctrl.ranking.length != 0">
        <div
          infinite-scroll="$ctrl.ranking.nextPage()"
          infinite-scroll-disabled="$ctrl.ranking.busy"
          infinite-scroll-distance="1"
          class="row best__container">
          <div ng-repeat="post in $ctrl.ranking.items" ng-if="$ctrl.ranking.items.length != 0" class="best__post">
            <div class="best__overlay"></div>
              <section class="best__attribution best__text">
                <div class="rank">
                  <div>{{$index + 1}}位</div>
                </div>
                <div class="use__container">
                  <span class="use-counts">{{::post.count}} count</span>
                  <span class="use-separator">·</span>
                  <span class="use-rate">{{::post.useRate}} %</span>
                </div>
                <div class="title">
                  <div>
                    <a class="inherit-link" href="{{::post.siteUrl}}" target="_blank">{{::post.title}}</a>
                  </div>
                </div>
                <div class="hostname">
                  <div>{{::post.hostName}}</div>
                </div>
                <section class="best__control">
                  <div>
                    <a class="inherit-link">
                      <i page-type="done" post-object-id="{{::post._id}}" open="open" title="新しいウィンドウで見る" class="fa__size--sm clickable fa fa-external-link"></i>
                    </a>
                  </div>
                </section>
              </section>
              <img
                ng-src="data/thumbnails/{{::post.fromImgSrc}}"
                to-img-src="data/images/{{::post.toImgSrc}}"
                img-src="data/images/{{::post.images.original}}"
                id="{{::post._id}}"
                pipe-low-to-high-image="pipe-low-to-high-image"
                open-zoom-image-viewer="open-zoom-image-viewer"
                class="item__image best__image"/>
            </div>
          </div>
        </div>
      </span>
      <span ng-if="$ctrl.ranking.busy">
        <img src="./front/images/loaders/puff.svg" class="puff-loader"/>
      </span>

      <span ng-if="$ctrl.isPreparing">
        <img src="./front/images/loaders/puff.svg" class="puff-loader"/>
      </span>
    </div>
    """
    bindToController: {}
    controller: StatsYearAggregationContainerController
    controllerAs: "$ctrl"

class StatsYearAggregationContainerController
  constructor: (@$scope, @$routeParams, @StatsService, @YearlyBestPost) ->
    console.log '@$routeParams.year ', @$routeParams.year
    @year = @$routeParams.year
    @ranking = null
    @isPreparing = true
    @set()

  set: ->
    @StatsService.findByYear(year: @year)
    .then (response) =>
      console.log response.data.total
      @ranking = new @YearlyBestPost(null, response.data.ranking, response.data.total.count)
    .catch (err) =>
      @ranking = new @YearlyBestPost(null, [], 0)
    .finally =>
      @isPreparing = false

StatsYearAggregationContainerController.$inject = ['$scope', '$routeParams', 'StatsService', 'YearlyBestPost']