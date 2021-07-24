angular.module "myApp.factories"
  .factory 'RandomPost', (RequestService, Post) ->
    class RandomPost  extends Post

      constructor: (@userObjectId, @type, @filter = 'all', @sort = 'updateAtDesc', @searchWord = '', @during = 'all') ->
        super(this.userObjectId, this.type, this.filte, this.sort, this.searchWord, this.during)  # @userObjectIdだとトランスパイルエラー
        @limit = 6
        @totalCount = 0
        @maxSkip = 0 
        @doneSkip = []

      randomAccess: ->
        loop
          skip = _.sample _.range(@maxSkip)
          break if !@doneSkip.includes(skip) or @doneSkip.length >= @maxSkip
        @doneSkip.push skip
        @skip = skip * @limit

        qs = @createQueryString()
        url = "#{@endpoint}?#{qs}"
        RequestService.get(url)
        .then (response) =>

          if @isEmptyNextPost() then @isLast = true
          if @isComppletedLoading(response.data) then @isLast = true

          @addPost(response.data)
          @afterAdded()
          if ga? then ga('send', 'pageview', url)
          @skip += @limit
          @isLast = true if @doneSkip.length >= @maxSkip
          @busy = false
        .catch (err) -> console.log err

      nextPage: ->
        return if @busy or @isLast
        @busy = true

        qs = @createQueryString()
        unless @totalCount is 0
          @randomAccess(qs)
        else
          RequestService.get("#{@endpoint}/#{@type}/count?#{qs}")
          .then (response) =>
            @totalCount = response.data.count
            @maxSkip = (@totalCount - 1) / @limit
            console.log(response.data.count, @numMaxSkip, @limit)
            @randomAccess(qs)

    RandomPost
