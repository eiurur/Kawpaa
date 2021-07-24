angular.module "myApp.directives"
  .directive 'goToTop', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="footer__buttons-wrapper">
        <div class="footer__buttons">
          <div scroll-to="body" scroll-on-click="scroll-on-click" class="footer__input-wrapper clickable">
            <span class="fa-stack fa">
                <i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-angle-up fa-stack-1x icon--clickable"></i>
            </span>
          </div>
        </div>
      </div>
    """