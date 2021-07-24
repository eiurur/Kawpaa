angular.module "myApp.factories"
  .factory 'DashboardPost', (Post, $interval, $timeout) ->
    class DashboardPost extends Post

      constructor: (hostnames) ->
        super(null, 'dashboard') # findのユーザIDは特定のユーザの投稿ではないのでnull
        @sort = 'createdAtDesc' 
        @endpoint = '/api/dashboard'
        @hostnames = hostnames
        @masonry = new MiniMasonry({container: '#macy'})

      getQueryString: ->
        limit: @limit
        skip: @skip
        filter: @filter
        sort: @sort
        hostnames: @hostnames

      afterAdded: ->
        $timeout =>
          @recalcLayout()
          $timeout =>
            hides = angular.element('#macy').find('.dashboard__post:not(.show)')
            angular.forEach hides, (element) =>
              ele = angular.element(element)
              ele.addClass('show')
            @recalcLayout()
          , 1000
        , 66

      recalcLayout: ->
        if @masonry then @masonry.layout()
        
    DashboardPost
