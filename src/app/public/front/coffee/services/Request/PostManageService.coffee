# Services
angular.module "myApp.services"
  .service "PostManageService", ($q, NotifyService, PromiseService,  RequestService) ->
    sleep : (ms) ->
      return $q (resolve, reject) -> setTimeout(resolve, ms)

    findByObjectId: (params) ->
      url = "/api/posts/#{params.pageType}/#{params.postObjectId}"
      PromiseService.get(url)

    findUnearth: (params) ->
      url = "/api/unearth/#{params.type}/#{params.amount}"
      PromiseService.get(url)

    archive: (params) ->
      # 理想
      # post =
      #   postObjectId: params.postObjectId
      #   isArchive: true
      #   isDone: false
      # url = '/api/posts'
      # payload = post: post
      # PromiseService.post(url, payload)
      return $q (resolve, reject) ->
        post =
          postObjectId: params.postObjectId
          isArchive: true
          isDone: false
        url = '/api/posts'
        payload = post: post
        RequestService.put url, payload
        .then (response) ->
          NotifyService.success 'アーカイブに保存しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    favorite: (params) ->
      return $q (resolve, reject) ->
        RequestService.post "/api/favorites/#{params.postObjectId}"
        .then (response) ->
          NotifyService.success 'お気に入りに追加しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    unfavorite: (params) ->
      return $q (resolve, reject) ->
        RequestService.delete "/api/favorites/#{params.postObjectId}"
        .then (response) ->
          NotifyService.success 'お気に入りから削除しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    # NotifyServiceの依存関係を極力減らすためにここに定義
    construction: ->
      NotifyService.infomation 'その機能は実装中です。もう少しだけお待ちください。'

    done: (params) ->
      return $q (resolve, reject) ->
        post =
          postObjectId: params.postObjectId
          numDone: 1

        RequestService.post '/api/dones', post: post
        .then (response) ->
          if _.has response.data, 'err'
            NotifyService.error data.err.statusText
            return reject

          NotifyService.success '射精しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    flucate: (params) ->
      return $q (resolve, reject) ->
        if params.type isnt 'increase'
          if params.numDone - 1 <= 0
            NotifyService.error '射精回数の下限です。'
            return reject 0

        message = if params.type is 'increase' then '射精しました' else '射精記録を取り消しました'
        addAmount = if params.type is 'increase' then 1 else -1
        
        if params.type is 'decrease'
          return reject unless window.confirm("射精記録を取り消してもよろしいですか？")

        # CAUTION: donePostObjectIdではなく、postObjectId
        donePost =
          postObjectId: params.postObjectId
        RequestService.put '/api/dones/flucate', donePost: donePost, type: params.type
        .then (response) ->
          NotifyService.success message
          return resolve addAmount
        .catch (err) ->
          NotifyService.error err.statusText

    addInbox: (params) ->
      return $q (resolve, reject) ->
        post =
          postObjectId: params.postObjectId
          isArchive: false
          isDone: false

        RequestService.post "/api/posts/inbox/#{params.postObjectId}", post: post
        .then (response) ->
          NotifyService.success 'Inboxに追加しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    revertInbox: (params) ->
      return $q (resolve, reject) ->
        post =
          postObjectId: params.postObjectId
          isArchive: false

        RequestService.put "/api/posts", post: post
        .then (response) ->
          NotifyService.success 'Inboxに戻しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText

    remove: (params) ->
      return $q (resolve, reject) ->
        RequestService.delete "/api/posts/#{params.type}/#{params.postObjectId}"
        .then (response) ->
          NotifyService.success '削除しました'
          return resolve response.data
        .catch (err) ->
          NotifyService.error err.statusText