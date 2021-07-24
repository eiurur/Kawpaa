angular.module "myApp.directives"

  .directive 'archive', (PostManageService) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      archive = ->
        # When 個別ページ
        # 自ウィンドウを閉じる https://web-designer.cman.jp/javascript_ref/window/close/
        if !scope.posts?
          open(location, '_self').close()
        else
          # When list
          idx = _.findIndex scope.posts.items, '_id': attrs.postObjectId
          scope.posts.items.splice idx, 1

      element.on 'click', ->
        params = postObjectId: attrs.postObjectId
        PostManageService.archive params
        .then (data) -> archive()
        .catch (err) -> console.log err


  .directive 'construction', (NotifyService) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'click', ->
        NotifyService.infomation 'その機能は実装中です。もう少しだけお待ちください。'

  # 初めて抜いたとき
  .directive 'done', (PostManageService) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      done = ->
        # When 個別ページ
        # 自ウィンドウを閉じる https://web-designer.cman.jp/javascript_ref/window/close/
        if !scope.posts?
          open(location, '_self').close()
        else
          # When list
          idx = _.findIndex scope.posts.items, '_id': attrs.postObjectId
          scope.posts.items.splice idx, 1

      element.on 'click', ->
        params = postObjectId: attrs.postObjectId
        PostManageService.done params
        .then (data) -> done()
        .catch (err) -> console.log err

  # 抜いた数の増減
  .directive 'flucate', (PostManageService) ->
    restrict: 'A'
    scope:
      numDone: '='
      postObjectId: '@'
      type: '@'
    link: (scope, element, attrs) ->
      element.on 'click', ->
        params =
          postObjectId: scope.postObjectId
          numDone: scope.numDone
          type: scope.type
        PostManageService.flucate params
        .then (variationNum) ->
          scope.numDone += variationNum
          console.log variationNum
        .catch (err) -> console.log err

  .directive 'favorite', (PostManageService) ->
    restrict: 'A'
    scope:
      favorited: '='
    link: (scope, element, attrs) ->
      element.on 'click', ->
        params =
          postObjectId: attrs.postObjectId

        if scope.favorited
          element.removeClass('favorited')
          PostManageService.unfavorite params
          .then (data) -> scope.favorited = !scope.favorited
          .catch (err) -> console.log err
        else
          element.addClass('favorited')
          PostManageService.favorite params
          .then (data) -> scope.favorited = !scope.favorited
          .catch (err) -> console.log err

      # ショートカットキーでふぁぼつけたとき、スタイルが反映されずに困ったのでwatchする。
      # favoriteが付与できるPostを読み込むたびに処理が呼び出されるので注意
      scope.$watch 'favorited', (newValue, oldValue) ->
        if newValue then element.addClass('favorited') else element.removeClass('favorited')
      , true


  .directive 'addInbox', (PostManageService) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      addInbox = ->
          # When 個別
          # 自ウィンドウを閉じる https://web-designer.cman.jp/javascript_ref/window/close/
          if !scope.posts?
            open(location, '_self').close()
          else
            # When list
            idx = _.findIndex scope.posts.items, '_id': attrs.postObjectId
            scope.posts.items.splice idx, 1

      element.on 'click', ->
        params = postObjectId: attrs.postObjectId
        PostManageService.addInbox params
        .then (data) -> addInbox()
        .catch (err) -> console.log err

  .directive 'revertInbox', (PostManageService) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      revert = ->
        # When 個別ページ
        # 自ウィンドウを閉じる https://web-designer.cman.jp/javascript_ref/window/close/
        if !scope.posts?
          open(location, '_self').close()
        else
          # When list
          idx = _.findIndex scope.posts.items, '_id': attrs.postObjectId
          scope.posts.items.splice idx, 1

      element.on 'click', ->
        params = postObjectId: attrs.postObjectId
        PostManageService.revertInbox params
        .then (data) -> revert()
        .catch (err) -> console.log err

  # postDirectiveに分けるべきか？
  .directive 'remove', (PostManageService) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      remove = ->
        # When 個別ページ
        # 自ウィンドウを閉じる https://web-designer.cman.jp/javascript_ref/window/close/
        if !scope.posts?
          open(location, '_self').close()
        else
          # When list
          idx = _.findIndex scope.posts.items, '_id': attrs.postObjectId
          scope.posts.items.splice idx, 1

      element.on 'click', ->
        params =
          postObjectId: attrs.postObjectId
          type: attrs.type
        return unless window.confirm("削除してもよろしいですか？")
        PostManageService.remove params
        .then (data) -> remove()
        .catch (err) -> console.log err
