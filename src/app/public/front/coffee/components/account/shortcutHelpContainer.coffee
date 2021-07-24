angular.module "myApp.directives"
  .directive "shortcutHelpContainer", ->
    restrict: 'E'
    scope: {}
    template: """
    <section class="fullscreen-overlay shortcut__container" ng-show="$ctrl.show">
      <div class="shortcut__list">
        <div class="col-md-12">
          <h3>ショートカットキー一覧</h3>
          <h5>
          ショートカットキーの一覧です。<br/>
          ページによって利用できるショートカットキーが異なります。
          </h5>
          <span class="shortcut__close" ng-click="$ctrl.close()">
            <i class="fa fa-times fa-2x" aria-hidden="true"></i>
          </span>
        </div>
        <div class="col-md-3 col-sm-6" ng-repeat="command in $ctrl.commands">
          <h5>{{command.name}}</h5>
          <pre><code>{{command.key}}</code></pre>
        </div>
      </div>
    </section>
    """
    bindToController: {}
    controller: ShortcutHelpController
    controllerAs: "$ctrl"

class ShortcutHelpController
  constructor: (@$scope, CommandService, @WindowScrollableSwitcher) ->
    @show = false
    @commands = CommandService.commands
    @bindKeyAction()
    @$scope.$on '$destroy', => @unbindKeyAction()

  close: ->
    @show = false
    @WindowScrollableSwitcher.enableScrolling()

  bindKeyAction: ->
    Mousetrap.bind ['h'], =>
      @show = !@show
      if @show
        @WindowScrollableSwitcher.disableScrolling()
      else
        @WindowScrollableSwitcher.enableScrolling()
      @$scope.$apply()

  unbindKeyAction: ->
    Mousetrap.unbind ['h']

ShortcutHelpController.$inject = ['$scope', 'CommandService', 'WindowScrollableSwitcher']