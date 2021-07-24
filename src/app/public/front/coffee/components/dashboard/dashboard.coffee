angular.module "myApp.directives"
  .directive 'dashboard', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="dashboard__controls">
        <div class="selectable-buttons">
          <span class="button button--active" ng-click="$ctrl.changeFilter('danbooru.donmai.us')" data-hostname="danbooru.donmai.us">Danbooru</span>
          <span class="button" ng-click="$ctrl.changeFilter('chan.sankakucomplex.com')" data-hostname="chan.sankakucomplex.com">Sankaku Complex</span>
          <span class="button" ng-click="$ctrl.changeFilter('yande.re')" data-hostname="yande.re">yande.re</span>
          <span class="button" ng-click="$ctrl.changeFilter('www.pixiv.net')" data-hostname="www.pixiv.net">pixiv</span>
          <span class="button" ng-click="$ctrl.changeFilter('twitter.com')" data-hostname="twitter.com">Twitter</span>
          <span class="button" ng-click="$ctrl.changeFilter('tweetdeck.twitter.com')" data-hostname="tweetdeck.twitter.com">TweetDeck</span>
        </div>
      </div>
      <zoom-image-viewer page-type="$ctrl.pageType" posts="$ctrl.posts.items"></zoom-image-viewer>
      <div class="dashboard__container">
        <div id="macy"
            infinite-scroll="$ctrl.posts.nextPage()"
            infinite-scroll-disabled="$ctrl.posts.busy"
            infinite-scroll-distance="5">
          <div ng-repeat="post in $ctrl.posts.items" class="dashboard__post item" >
              <img class="dashboard__img"
                ng-src="data/thumbnails/{{::post.fromImgSrc}}" 
                to-img-src="data/thumbnails/{{::post.toImgSrc}}" 
                img-src="data/images/{{::post.images.original}}" 
                pipe-low-to-high-image="pipe-low-to-high-image"
                post="post"
                open-zoom-image-viewer="open-zoom-image-viewer"
                id="{{::post._id}}">
              <div class="dashboard__post__body">
                <a href="{{::post.siteUrl}}" target="_blank" class="dashboard__link">
                  <div class="dashboard__post__description">
                    {{::post.title}}
                  </div>
                </a>
              </div>
              <div class="dashboard__post__footer">
                <span class="clickable dashboard__link" ng-click="$ctrl.addInbox(post._id)">
                  <i post-object-id="{{::post._id}}" class="fa fa-inbox icon-inbox"></i>
                  Inbox
                </span>
                <span class="dashboard__post__via">
                  <a href="{{::post.siteUrl}}" target="_blank">
                    <img ng-src="{{::post.favicon}}">
                  </a>
                </span>
              </div>
          </div>
        </div>
        <span class="dashboard__loading" ng-if="$ctrl.posts.busy">
          <img src="front/images/loaders/puff.svg" />
        </span>
      </div>
      <go-to-top></go-to-top>
    """
    bindToController: {}
    controller: DashboardController
    controllerAs: "$ctrl"

class DashboardController
  constructor: (@$scope, @DashboardPost, @KawpaaLocalStorageService, @PromiseService, @PostManageService) ->
    @pageType = 'dashboard'
    @setFilters()
    @changeFilter()

  setFilters: ->
    if @KawpaaLocalStorageService.isEmpty('explore.actives')
      @filters = @DEFAULT_FILTERS
    else 
      @filters = @KawpaaLocalStorageService.get('explore.actives').split(',')

  changeFilter: (hostname) ->
    if hostname 
      if @filters.includes(hostname) 
        @filters = @filters.filter (h, i) => h isnt hostname
      else 
        @filters.push(hostname)
    @filters = Array.from(new Set(@filters))

    if @filters.length < 1
      @filters.push(hostname)

    @fillActive()
    @load()
    @KawpaaLocalStorageService.set('explore.actives', @filters.join(','))

  load: ->
    @posts = new @DashboardPost(@filters)
    @posts.nextPage() # MinMasonryとの相性が悪いのか、次が読み込まれない場合あるので
  
  fillActive: ->
    buttons = angular.element('.selectable-buttons').find('.button')
    angular.forEach buttons, (element) =>
      ele = angular.element(element)
      ele.removeClass('button--active')
      if @filters.includes(ele.data('hostname')) then ele.addClass('button--active')

  addInbox: (postObjectId) ->
    params = postObjectId: postObjectId
    @PostManageService.addInbox params  
    .then (data) -> console.log data
    .catch (err) -> console.log err

  DEFAULT_FILTERS: [
    'twitter.com'
    'tweetdeck.twitter.com'
    'www.pixiv.net'
    'danbooru.donmai.us'
    'chan.sankakucomplex.com'
    'yande.re'
  ]

DashboardController.$inject = ['$scope', 'DashboardPost', 'KawpaaLocalStorageService', 'PromiseService', 'PostManageService']