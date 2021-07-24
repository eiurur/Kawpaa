angular.module "myApp.factories"
  .factory 'Post', ($analytics, $httpParamSerializer, RequestService, ImageTransitionService) ->
    class Post

      # @type [String] archive, fav, done
      constructor: (@userObjectId, @type, @filter = 'all', @sort = 'updateAtDesc', @searchWord = '', @during = 'all') ->
        @busy   = false
        @isLast = false
        @skip   = 0
        @limit  = 20
        @archived = @type is 'archive'
        @items  = []
        @fromImgWidth = 30
        @middleImgSrc = 240
        @toImgWidth = 480
        @width_thumbnails_filename_pattern = /(_w\w*)/ # 画像のファイル名の_はwidthを表す数字の前にしか表れない仕様だからこのパターンでいける。
        @endpoint = '/api/posts'

      hasMadeThumbnails: (item) -> item?.images?

      normalizeItem: (item) ->
        item.createdAtFormatedYMD = moment(new Date(item.createdAt)).format("YYYY年MM月DD日　HH時mm分ss秒")
        return item unless @hasMadeThumbnails(item)
        item.fromImgSrc = item.images[ImageTransitionService.post.from]
        item.middleImgSrc = item.images[ImageTransitionService.post.middle]
        item.toImgSrc = item.images[ImageTransitionService.post.to]
        return item

      addPost: (items) ->
        return unless Array.isArray(items)
        items.map (item) => @items.push @normalizeItem(item)
      
      beforeAdded: -> true
      afterAdded: -> true

      createQueryString: -> $httpParamSerializer(@getQueryString())

      getQueryString: ->
        archived: @archived
        type: @type
        searchWord: @searchWord
        limit: @limit
        skip: @skip
        filter: @filter
        during: @during
        sort: @sort

      isEmptyNextPost: -> _.isUndefined @items

      isComppletedLoading: (items) -> items.length isnt @limit

      nextPage: ->
        return if @busy or @isLast
        @busy = true

        qs = @createQueryString()
        url = "#{@endpoint}?#{qs}"
        RequestService.get(url)
        .then (response) =>
          console.log response.data

          if @isEmptyNextPost() then @isLast = true
          if @isComppletedLoading(response.data) then @isLast = true

          @addPost(response.data)
          @afterAdded()
          $analytics.pageTrack(url);
          @skip += @limit
          @busy = false
        .catch (err) -> console.log err

    Post
