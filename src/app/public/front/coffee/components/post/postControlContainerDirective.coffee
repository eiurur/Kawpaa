angular.module "myApp.directives"
  .directive 'postControlContainer', ($parse, $compile, PostManageService, URLParameterService) ->
    restrict: 'E'
    compile: (element, attrs) ->
      # Ref -> javascript - AngularJs: Customizing the template within a Directive - Stack Overflow http://stackoverflow.com/questions/10629238/angularjs-customizing-the-template-within-a-directive
      getterPageType = $parse attrs.pageType
      getterPostObjectId = $parse attrs.postObjectId

      return (scope, element, attrs) ->
        pageType = getterPageType(scope)
        postObjectId = getterPostObjectId(scope)
        switch pageType
          when 'archive'
            html = """
              <div class='post__control--container'>
                <div class='post__control'>
                  <i post-object-id="{{::postObjectId}}" done="done" class="fa__size--sm clickable fa fa-tint icon-tint"></i>
                  <i post-object-id="{{::postObjectId}}" revert-inbox="revert-inbox" class="fa__size--sm clickable fa fa-inbox icon-inbox"></i>
                  <i post-object-id="{{::postObjectId}}" type="{{::pageType}}" remove="remove" class="fa__size--sm clickable fa fa-trash icon-trash"></i>
                </div>
              </div>
            """
          when 'done', 'favorite'
            html = """
              <div class='post__control--container'>
                <div class='post__control'>
                  <i post-object-id="{{::postObjectId}}" done="done" class="fa__size--sm clickable fa fa-tint icon-tint"></i>
                  <i post-object-id="{{::postObjectId}}" type="{{::pageType}}" remove="remove" class="fa__size--sm clickable fa fa-trash icon-trash"></i>
                </div>
              </div>
            """
          when 'find'
            html = """
              <div class='post__control--container'>
                <div class='post__control'>
                  <i post-object-id="{{::postObjectId}}" construction="construction" class="fa__size--sm fa fa-magic icon-tint"></i>
                  <i post-object-id="{{::postObjectId}}" add-inbox="add-inbox" class="fa__size--sm clickable fa fa-inbox icon-inbox"></i>
                </div>
              </div>
            """
          else
            html = """
              <div class='post__control--container'>
                <div class='post__control'>
                  <i post-object-id="{{::postObjectId}}" done="done" class="fa__size--sm clickable fa fa-tint icon-tint"></i>
                  <i post-object-id="{{::postObjectId}}" archive="archive" class="fa__size--sm clickable fa fa-check icon-check"></i>
                  <i post-object-id="{{::postObjectId}}" type="{{::pageType}}" remove="remove" class="fa__size--sm clickable fa fa-trash icon-trash"></i>
                </div>
              </div>
            """
        element.replaceWith($compile(html)(scope))

        # Bind key command
        # post個別ページのURLのスキームが一定の法則から成り立っているから可能な処理
        # -> https://127.0.0.1:9021/post/archive/56741f52793d9558eaa0d1b9
        ### urlParams is
        Array[4]
          0: ""
          1: "post"
          2: "archive"
          3: "56741f52793d9558eaa0d1b9"
          length: 4
        ###
        URLParameterService.redirectHomeIfExceptionUrl(4)
        {pageType: pageType, postObjectId: postObjectId} = URLParameterService.getParameters('post')
        console.log pageType, postObjectId

        # HACK: zoomImageDirectiveからコピペ。
        switch pageType
          when 'archive'
            Mousetrap.bind 'd', -> done()
            Mousetrap.bind 'i', -> revertInbox()
            Mousetrap.bind 'r', -> remove()
          when 'done'
            Mousetrap.bind 'd', -> done()
            Mousetrap.bind 'r', -> remove()
          when 'find'
            Mousetrap.bind 'd', -> construction() # TODO
            Mousetrap.bind 'i', -> addInbox()
          else # addInbox
            Mousetrap.bind 'a', -> archive()
            Mousetrap.bind 'd', -> done()
            Mousetrap.bind 'r', -> remove()

        archive = ->
          params =
            postObjectId: postObjectId
          PostManageService.archive params
          .then (data) -> open(location, '_self').close()
          .catch (err) -> console.log err

        construction = ->
          PostManageService.construction()

        done = ->
          params =
            postObjectId: postObjectId
          PostManageService.done params
          .then (data) -> open(location, '_self').close()
          .catch (err) -> console.log err

        addInbox = ->
          params =
            postObjectId: postObjectId
          PostManageService.addInbox params
          .then (data) -> open(location, '_self').close()
          .catch (err) -> console.log err

        revertInbox = ->
          params =
            postObjectId: postObjectId
          PostManageService.revertInbox params
          .then (data) -> open(location, '_self').close()
          .catch (err) -> console.log err

        remove = ->
          params =
            postObjectId: postObjectId
            type: pageType
            
          return unless window.confirm("削除してもよろしいですか？")
          PostManageService.remove params
          .then (data) -> open(location, '_self').close()
          .catch (err) -> console.log err