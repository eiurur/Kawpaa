angular.module "myApp.directives"
  .directive 'historyHeatmap', ->
    restrict: 'E'
    scope: {}
    template: """
      <section class="heatmap-container">
        <section ng-show="$ctrl.recordNum != 0">
          <div class="history-heatmap-container">
            <div class="history-heatmap-container__title">
              <p>Activity</p>
            </div>
            <div id="heatmap" ng-class="{'days-selected': $ctrl.daysSelected}"></div>
          </div>
        </section>

      </section>
    """
    bindToController: {}
    controller: HistoryHeatmapController
    controllerAs: "$ctrl"

class HistoryHeatmapController
  constructor: (@$scope, @PromiseService, @TimeService, @$httpParamSerializer) ->
    @recordNum = 0
    @isLoading = true
    @highlightDate = null
    @daysSelected = false 
    @init()

  init: ->
    @fetchHistory()

  create: (data) ->
    cal = new CalHeatMap
    start = moment().subtract(11, 'month').toDate()
    cal.init
      itemSelector: '#heatmap'
      data: data
      domain: 'month'
      domainLabelFormat: '%Y-%m'
      start: start
      cellSize: 14
      range: 12
      weekStartOnMonday: false
      legendColors: 
        empty: '#bbb'
        min: "#b2f5fc"
        max: "#00b2c5"
      onClick: (date, nb) =>
        newHightlighDate = @TimeService.normalizeDate(@TimeService.type.DAYS, date)
        if @highlightDate is newHightlighDate
          @daysSelected = false
          @highlightDate = newHightlighDate
          cal.highlight()
          @$scope.$emit 'doneHistoryCtrl::focusDate', date: null
        else 
          @daysSelected = true
          @highlightDate = newHightlighDate
          cal.highlight(new Date(date))
          @$scope.$emit 'doneHistoryCtrl::focusDate', date: date

  fetchHistory: ->
    qs = @$httpParamSerializer
      begin: moment().subtract(11, 'month').startOf('month').format('YYYY-MM-DD')
      end: moment().endOf().format('YYYY-MM-DD')
    console.log(qs)
    @PromiseService.get("/api/stats/count/days?#{qs}")
    .then (response) =>
      @recordNum = Object.keys(response.data)
      @create(response.data)
      @isLoading = false
    .catch (err) =>
      @isLoading = false

HistoryHeatmapController.$inject = ['$scope', 'PromiseService', 'TimeService', '$httpParamSerializer']
