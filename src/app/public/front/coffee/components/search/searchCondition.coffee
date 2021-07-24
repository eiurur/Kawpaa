angular.module "myApp.directives"
  .directive 'searchCondition', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="footer__buttons-wrapper">
        <div class="footer__buttons">
          <div scroll-to="body" scroll-on-click="scroll-on-click" class="footer__input-wrapper clickable">
            <span class="fa-stack fa button">
                <i class="fa fa-stack-2x"></i><i class="fa fa-angle-up fa-stack-1x icon--clickable"></i>
            </span>
          </div>
        </div>
        <div ng-show="$ctrl.isShown" ng-click="$ctrl.open()" class="footer__buttons button--open__post-contorol-container col-md-12 col-lg-12">
          <div class="footer__input-wrapper clickable">
            <span class="fa-stack fa button">
              <i class="fa fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x icon--clickable"></i>
            </span>
          </div>
        </div>
      </div>

      <div ng-show="$ctrl.isOpened" class="search-condition__container col-sm-12 col-md-12 col-lg-12">
        <form class="form">
          <div class="form-group">
            <div class="input-group"><span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
              <select ng-model="$ctrl.duringList.selected" ng-options="l.k for l in $ctrl.duringList.items track by l.k">
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="input-group"><span class="input-group-addon"><i class="fa fa-filter"></i></span>
              <select ng-model="$ctrl.filterTypeList.selected" ng-options="l.k for l in $ctrl.filterTypeList.items track by l.k">
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="input-group"><span class="input-group-addon"><i class="fa fa-sort"></i></span>
              <select ng-model="$ctrl.sortTypeList.selected" ng-options="l.k for l in $ctrl.sortTypeList.items track by l.k">
              </select>
            </div>
          </div>
        </form>
      </div>
    """
    bindToController: {}
    controller: SearchConditionController
    controllerAs: "$ctrl"

class SearchConditionController
  constructor: (@$scope, @ConstantsService, @NotifyService, @URLParameterService) ->
    @isShown = true
    @isOpened = false
    @setConditionList()
    @onChangeCondition()
    @onKeyEvent()
    @onDestroy()

  setConditionList: ->
    params = @URLParameterService.getParameters('main')
    type = params.pageType.toLowerCase()
    if /(done|favorite)/.exec(type.toLowerCase())
      sortTypeListItems = @ConstantsService.SORT_TYPE_LIST.items
    else
      sortTypeListItems = _.filter @ConstantsService.SORT_TYPE_LIST.items, (item) -> return item.t is 'all'

    @duringList =
      items: @ConstantsService.DURING_LIST.items
      selected: @ConstantsService.DURING_LIST.selected

    @filterTypeList =
      items: @ConstantsService.FILTER_TYPE_LIST.items
      selected: @ConstantsService.FILTER_TYPE_LIST.selected

    @sortTypeList =
      items: sortTypeListItems
      selected: @ConstantsService.SORT_TYPE_LIST.selected

  onChangeCondition: ->
    @$scope.$watch angular.bind(this, ->
      @duringList.selected
    ), (newData, oldData) =>
      return if newData is oldData
      @$scope.$emit 'SearchCondition::change', during: newData
      return

    @$scope.$watch angular.bind(this, ->
      @filterTypeList.selected
    ), (newData, oldData) =>
      return if newData is oldData
      @$scope.$emit 'SearchCondition::change', filterType: newData
      return

    @$scope.$watch angular.bind(this, ->
      @sortTypeList.selected
    ), (newData, oldData) =>
      return if newData is oldData
      @$scope.$emit 'SearchCondition::change', sortType: newData
      return

  onKeyEvent: ->

    change = (what, list) =>
      return if list.items.length < 2
      currentIdx = list.items.findIndex (item) -> item.v is list.selected.v
      nextIdx = currentIdx + 1
      idx = nextIdx % list.items.length 
      list.selected = list.items[idx]
      @NotifyService.infomation("#{what}を「#{list.selected.k}」に切り替えました")
      @$scope.$apply()
      return list

    Mousetrap.bind ['p p'], =>
      @duringList = change("表示期間", @duringList)

    Mousetrap.bind ['s s'], =>
      @sortTypeList = change("ソート順", @sortTypeList)

    Mousetrap.bind ['t t'], =>
      @filterTypeList = change("フィルタの種類", @filterTypeList)

  offKeyEvent: -> 
    Mousetrap.unbind ['p p', 's s', 't t']

  onDestroy: ->
    @$scope.$on '$destroy', => @offKeyEvent()

  open: ->
    @isOpened = true
    html = angular.element(document).find('html')

    # 画面全体を覆う透明のオーバーレイ要素を生成
    overlayHTML = "<div class='search-condition__container__overlay'></div>"
    html.append overlayHTML

    # オーバーレイ要素をクリック === ControlContainer以外をクリック なら controlContainerを閉じる
    postsControlContainerOverlay = angular.element(document).find('.search-condition__container__overlay')
    postsControlContainerOverlay.on 'click', =>
      postsControlContainerOverlay.off()  # これ必要？
      postsControlContainerOverlay.remove()
      @isOpened = false
      @$scope.$apply()
    return



SearchConditionController.$inject = ['$scope', 'ConstantsService', 'NotifyService', 'URLParameterService']
