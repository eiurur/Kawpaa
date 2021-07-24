angular.module "myApp.factories"
  .factory 'WindowScrollableSwitcher', ->
    class WindowScrollableSwitcher
      constructor: ->

      # @preventDefault: (e) ->
      #   e.preventDefault()
      #   # e = e || window.event
      #   # if e.preventDefault
      #   #   e.preventDefault()
      #   # e.returnValue = false

      @enableScrolling: ->
        window.onscroll = ->
          return

      @disableScrolling: ->
        x = window.scrollX
        y = window.scrollY
        window.onscroll = ->
          window.scrollTo x, y

    WindowScrollableSwitcher