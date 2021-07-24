angular.module "myApp.factories"
  .factory 'YearlyBestPost', (Post, ImageTransitionService) ->
    class YearlyBestPost extends Post

      constructor: (@userObjectId, @masterItems, @total) ->
        super(this.userObjectId, 'best') # @userObjectIdだとトランスパイルエラー

      # aggregateで返ってくるkeyが_idから変更できないのでこんな実装にしている
      normalizeItem: (item) ->
        _item = item._id
        _item.count = item.count
        _item.useRate = (item.count / @total * 100).toFixed(1)
        return item unless item?._id?.images?
        _item.fromImgSrc = item._id.images[ImageTransitionService.stats.from]
        _item.toImgSrc = item._id.images[ImageTransitionService.stats.to]
        return _item

      addPost: (items) ->
        return unless Array.isArray(items)
        items.map (item) =>
          item = @normalizeItem(item)
          @items.push item

      nextPage: ->
        return if @busy or @isLast
        @busy = true

        console.log @userObjectId
        console.log @limit
        console.log @skip

        items = @masterItems[@skip...@skip+@limit]
        if @isEmptyNextPost() then @isLast = true
        if @isComppletedLoading(items) then @isLast = true

        @addPost(items)
        @skip += @limit
        @busy = false


    YearlyBestPost
