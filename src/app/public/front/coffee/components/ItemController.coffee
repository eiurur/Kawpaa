angular.module "myApp.directives"
  .directive 'itemController', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="item__control">
        <div class="item__control--contents">
          <div class="item__control--contents--icons">
            <span>{{$ctrl.post.numDone}}</span>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              done="done"
              title="抜いた"
              ng-if="$ctrl.isShow.done"
              class="fa__size--sm clickable fa fa-tint icon-tint"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              num-done="$ctrl.post.numDone"
              type="increase"
              flucate="flucate"
              title="さらに抜いた"
              ng-if="$ctrl.isShow.flucate"
              class="fa__size--sm clickable fa fa-plus icon-plus"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              num-done="$ctrl.post.numDone"
              type="decrease"
              flucate="flucate"
              title="やっぱり抜いてない"
              ng-if="$ctrl.isShow.flucate"
              class="fa__size--sm clickable fa fa-minus icon-minus"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              favorited="$ctrl.post.favorited"
              favorite="favorite"
              title="お気に入りに追加する"
              ng-if="$ctrl.isShow.favorite"
              class="fa__size--sm clickable fa fa-heart icon-heart"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              archive="archive"
              title="アーカイブに保存する"
              ng-if="$ctrl.isShow.archive"
              class="fa__size--sm clickable fa fa-check icon-check"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              type="done"
              remove="remove"
              title="削除する"
              ng-if="$ctrl.isShow.remove"
              class="fa__size--sm clickable fa fa-trash icon-trash"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              remove="remove"
              title="削除する"
              ng-if="$ctrl.isShow.remove"
              class="fa__size--sm clickable fa fa-trash icon-trash"></i>
            <i
              post-object-id="{{$ctrl.post._id}}"
              posts="$ctrl.postList"
              add-inbox="add-inbox"
              title="Inboxに追加"
              ng-if="$ctrl.isShow.inbox"
              class="fa__size--sm clickable fa fa-inbox icon-inbox"></i>
            <!-- aタグがないとtextとcontrolsの間の余白がなくなり、レイアウトが崩れる。-->
            <a>
            <i page-type="{{$ctrl.post.category}}"
              post-object-id="{{$ctrl.post._id}}"
              open="open"
              title="新しいウィンドウで見る"
              ng-if="$ctrl.isShow.open"
              class="fa__size--sm clickable fa fa-external-link"></i>
            </a>
          </div>
        </div>
      </div>
    """
    bindToController:
      post: "="
      postList: "="
      pageType: "="
    controller: ItemController
    controllerAs: "$ctrl"

class ItemController
  constructor: (@$scope) ->
    @isShow = true

ItemController.$inject = ['$scope']
