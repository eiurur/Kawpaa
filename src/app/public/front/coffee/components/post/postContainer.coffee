angular.module "myApp.directives"
  .directive 'postContainer', ->
    restrict: 'E'
    scope: {}
    template: """
        <!-- width:100%を当てると左寄りになる -->
        <div ng-if="$ctrl.type == 'image'" class="w100 post__img__container">
          <img
            ng-src="data/images/{{$ctrl.src}}"
            id="{{$ctrl.id}}"
            change-img-wide-direction="change-img-wide-direction"
            initialize-img-wide-direction="initialize-img-wide-direction"
            on-rotate-image="on-rotate-image"
          />
        </div>
        <!-- width:100%にしないと動画の表示域が狭まる -->
        <div ng-if="$ctrl.type == 'link'" class="w100">
          <div ng-bind-html="$ctrl.content | trustedHtml" class="w100"></div>
        </div>
        <!-- width:100%にしないと動画の表示域が狭まる -->
        <div ng-if="$ctrl.type == 'video'" class="w100">
          <video poster="{{$ctrl.src}}" controls="controls" autoplay="autoplay" muted="muted" loop="loop" class="w100">
            <source ng-src="data/videos/{{$ctrl.videos.original}}">
            Your browser does not support the video tag.
          </video>
        </div>
        <div ng-if="$ctrl.type == 'text'" class="w100 post__text__container">
          <div ng-bind-html="$ctrl.content | trustedHtml" class="w100"></div>
        </div>
    """
    bindToController:
      type: "="
      src: "="
      id: "="
      link: "="
      content: "="
      videos: "="
    controller: PostContainerController
    controllerAs: "$ctrl"

class PostContainerController
  constructor: (@$scope, $sce) ->
    console.log 'PostContainerController', @id
    console.log 'PostContainerController', @content
    console.log 'PostContainerController', @videos

PostContainerController.$inject = ['$scope', '$sce']