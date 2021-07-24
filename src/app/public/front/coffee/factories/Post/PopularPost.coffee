angular.module "myApp.factories"
  .factory 'PopularPost', (Post) ->
    class PopularPost extends Post

      constructor: (term, date) ->
        super(null, 'find') # findのユーザIDは特定のユーザの投稿ではないのでnull
        @term = term
        @date = date
        @sort = 'siteNameAsc' # DLSiteのコンテンツのダウンロードが早く、デフォルトのupdatedAtだと必ず最下部に来てしまい、なんとなく見栄え悪し。なのでsiteName順に変更。

      getQueryString: ->
        type: @type
        limit: @limit
        skip: @skip
        filter: @filter
        sort: @sort
        term: @term
        date: @date

    PopularPost
