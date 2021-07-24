angular.module "myApp.directives"
  .directive 'donePostHistory', ->
    restrict: 'E'
    scope: {}
    template: """
      <section ng-if="$ctrl.isLoading">
        <img class="puff-loader" src="./front/images/loaders/puff.svg" />
      </section>
      <section ng-if="!$ctrl.isLoading" class="row" ng-repeat="itemList in $ctrl.history">
        <div class="relative-info__time">
          <span class="clickable" open-done="open-done" title="新しいウィンドウで開く" posts="itemList">
            {{::$ctrl.toYMDhm(itemList[0].createdAt)}}
            <i class="fa fa-external-link"></i>
          </span>
        </div>
        <div class="relative-info__post col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-3" ng-repeat="item in itemList">
          <a href="/post/done/{{::item.donePost._id}}">
            <img
              class="thumbail"
              ng-src="data/thumbnails/{{::item.donePost.images.tiny}}"
              to-img-src="data/thumbnails/{{::item.donePost.images.medium}}"
              pipe-low-to-high-image="pipe-low-to-high-image"
              id="{{::item.donePost._id}}" />
          </a>
        </div>
      </section>
    """
    bindToController:
      postObjectId: "=" 
    controller: DonePostHistoryController
    controllerAs: "$ctrl"

class DonePostHistoryController
  constructor: (@$scope, @$location, @PromiseService, URLParameterService) ->
    @history = []
    @isLoading = true
    # FIXME: AngularJS1.6から何故か@postObjectIdが参照できない。
    # このControllerのみ。@のプロパティには生えているけど参照できない。
    params = URLParameterService.getParameters('donePairs')
    @pageType = params.pageType 
    @postObjectId = params.postObjectId 
    @init()


  init: ->
    if @pageType is 'done' or @pageType is 'favorite'
      @fetchHistory()
    else
      @isLoading = false

  toYMDhm: (time) ->
    return moment(time).format('YYYY-MM-DD HH:mm')

  moveTo: (donePostObjectId) ->
    url = "/post/done/#{donePostObjectId}"
    @$location.path url

  fetchHistory: ->
    @PromiseService.get("/api/dones/pairs/#{@postObjectId}")
    .then (response) =>
      @history = response.data
      @isLoading = false
    .catch (err) =>
      @isLoading = false

DonePostHistoryController.$inject = ['$scope', '$location', 'PromiseService', 'URLParameterService']