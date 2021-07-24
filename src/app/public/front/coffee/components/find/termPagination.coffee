angular.module "myApp.directives"
  .directive 'termPagination', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="pagination__term">
        <div class="pagination__arrow" ng-click="$ctrl.paginate(-1)">
          <div class="pagination__button--left">
            <a class="pagination__term--prev"><</a>
          </div>
        </div>
        <a class="pagination__term--active">{{$ctrl.date}}</a>
        <div class="pagination__arrow" ng-click="$ctrl.paginate(1)">
          <div class="pagination__button--right">
            <a class="pagination__term--next">></a>
          </div>
        </div>
      </div>
      <go-to-top></go-to-top>
    """
    bindToController:
      term: "="
    controller: TermPaginationController
    controllerAs: "$ctrl"

class TermPaginationController
  constructor: (@$scope, @TimeService, @TermPeginateDataServicve, URLParameterService) ->
    qs = URLParameterService.getQueryString()
    unless URLParameterService.hasQueryString() 
      # CAUTION momentに渡すtermはsがない。
      uniTerm = @term.splice(0, -1)
      qs.date = moment().subtract(1, uniTerm).format('YYYY-MM-DD')
    @date = @TimeService.normalizeDate(@term, qs.date)

    @subscribe()
    @bindKeyAction()
    @$scope.$on '$destroy', => @unbindKeyAction()

  bindKeyAction: ->
    Mousetrap.bind ['ctrl+shift+left'], => @paginate(-1)
    Mousetrap.bind ['ctrl+shift+right'], => @paginate(1)

  unbindKeyAction: ->
    Mousetrap.unbind ['ctrl+shift+left', 'ctrl+shift+right']

  subscribe: ->
    @$scope.$on 'TermPeginateDataServicve::publish', (event, args) => @date = args.date

  paginate: (amount) ->
    @date = @TimeService.changeDate(@term, @date, amount)
    @TermPeginateDataServicve.publish(date: @date)
    @$scope.$emit 'termPagination::paginate', date: @date

TermPaginationController.$inject = ['$scope', 'TimeService', 'TermPeginateDataServicve', 'URLParameterService']