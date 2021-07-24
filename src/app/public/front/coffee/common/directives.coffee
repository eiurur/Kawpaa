angular.module "myApp.directives"
  .directive 'toggleShow', ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'click', ->
        postsControlContainer = angular.element(document).find('.search-condition-container')
        console.log postsControlContainer
        postsControlContainer.hide()

  .directive "scrollOnClick", ->
    restrict: "A"
    scope:
      scrollTo: "@"
    link: (scope, element, attrs) ->
      element.on 'click', ->
        $('html, body').animate
          scrollTop: $(scope.scrollTo).offset().top, "slow"

  .directive 'icNavAutoclose', ->
    console.log 'icNavAutoclose'
    (scope, elm, attrs) ->
      collapsible = $(elm).find('.navbar-collapse')
      visible = false
      collapsible.on 'show.bs.collapse', ->
        visible = true
        return
      collapsible.on 'hide.bs.collapse', ->
        visible = false
        return
      $(elm).find('a').each (index, element) ->
        $(element).click (e) ->
          if visible and 'auto' == collapsible.css('overflow-y')
            collapsible.collapse 'hide'
          return
        return
      return

  .directive 'open', () ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'click', ->
        size = "width=#{screen.availWidth},height=#{screen.availHeight}"
        window.open "/post/#{attrs.pageType}/#{attrs.postObjectId}", '', size
