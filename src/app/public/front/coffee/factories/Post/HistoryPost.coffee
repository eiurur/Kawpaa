angular.module "myApp.factories"
  .factory 'HistoryPost', (ImageTransitionService, Post) ->
    class HistoryPost extends Post

      constructor: (@userObjectId, @date) ->
        super(this.userObjectId, 'doneHistory') # @userObjectIdだとトランスパイルエラー
        @rangeOfMinutesAsEquateTo = 3
        @lastItem = null

      getQueryString: ->
        type: @type
        limit: @limit
        skip: @skip
        date: @date


      normalizeItem: (item) ->
        item.createdAtFormatedYMD = moment(new Date(item.createdAt)).format("YYYY-MM-DD")
        item.createdAtFormatedHHmm = moment(new Date(item.createdAt)).format("HH:mm")
        return item unless item.donePost?.images?
        item.donePost.fromImgSrc = item.donePost.images[ImageTransitionService.post.from]
        item.donePost.toImgSrc = item.donePost.images[ImageTransitionService.post.to]
        return item

      isConcurrentDone: (item) ->
        from = moment(item.createdAt)
        to   = moment(@lastItem.createdAt)
        timeDiffLastDoneMinutes = Math.abs from.diff(to, 'minutes')
        return timeDiffLastDoneMinutes <= @rangeOfMinutesAsEquateTo

      isSameDay: (item) ->
        console.log(item.createdAt, @lastItem.createdAt)
        from = moment(item.createdAt).format('YYYY-MM-DD')
        to   = moment(@lastItem.createdAt).format('YYYY-MM-DD')
        return from is to

      addPost: (items) ->
        return unless Array.isArray(items)
        items.map (item) =>
          item = @normalizeItem(item)
          if @type is 'doneHistory'
            return unless item
            if @items.length > 0
              if @isSameDay(item) 
                if @isConcurrentDone(item)
                  _.last(_.last(@items)).push item
                else 
                  _.last(@items).push [item]
              else 
                @items.push [[item]]
            else
              @items.push [[item]]
          @lastItem = item

    HistoryPost
