angular.module "myApp.directives"
  .directive 'statsCounter', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="counter__overlay"></div>
        <section class="counter__text">
          <div class="year">
            <div class="counter__type">{{$ctrl.type}}</div>
            <div class="counter__count">
              <span class="counter__count--emphasize">{{$ctrl.count}}</span>
              <span>items</span>
            </div>
          </div>
        </section>
      <div>
    """
    bindToController: 
      type: "@"
      count: "@"
      icon: "@"
    controller: statsCounter
    controllerAs: "$ctrl"

class statsCounter
  constructor: () ->