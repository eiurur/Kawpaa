angular.module "myApp.services"
  .service "ItemSelectionService", ($q, PostManageService, TagManageService) ->
    type: null

    items: []

    intervalMs: 200

    setType: (type) -> 
      @type = type
  
    isSelected: -> 
      !@isEmpty()

    isEmpty: ->
      @items.length is 0

    list: -> 
      @items

    count: -> 
      @items.length

    # 前を見て、あればそこまで、なければ後ろを見てそこまで、それもなければ先頭から選択したところまで
    listRange: (selectingItem, posts) ->
      indexInAll = posts.items.findIndex (item) -> item._id is selectingItem.postObjectId
      if @isEmpty() then return posts.items[0..indexInAll] 

      indexInNextAll = posts.items[(indexInAll+1)..posts.items.length].findIndex (item) => 
        @list().findIndex((selectedItem) -> item._id is selectedItem.postObjectId) isnt -1
      if indexInNextAll isnt -1
        return posts.items[indexInAll..(indexInAll+indexInNextAll)]
      
      indexInPrevAll = posts.items[0...indexInAll].reverse().findIndex (item) => 
        @list().findIndex((selectedItem) -> item._id is selectedItem.postObjectId) isnt -1
      if indexInPrevAll isnt -1
        return posts.items[(indexInAll-indexInPrevAll)..indexInAll]

      return []

    findIndex: (newItem) ->
      return @items.findIndex (item) => item.postObjectId is newItem.postObjectId

    has: (newItem) ->
      return @findIndex(newItem) isnt -1

    add: (addingItem) -> 
      return if @has(addingItem)
      @items.push(addingItem)

    delete: (deletingItem) ->
      return unless @has(deletingItem) 
      index = @findIndex(deletingItem)
      @items.splice(index, 1)

    clear: ->  
      @items = []

    registerTag: (tags) ->
      items = @list()
      $q.all(items.map (item, index) => PostManageService.sleep(index * @intervalMs).then(() => TagManageService.register(Object.assign({}, item, {tags: tags})))).then (result) => console.log(result)
      return items


    addInbox: () -> 
      items = @list()
      $q.all(items.map (item, index) => PostManageService.sleep(index * @intervalMs).then(() => PostManageService.addInbox(item))).then (result) => console.log(result)
      @clear()
      return items

    revertInbox: () -> 
      items = @list()
      $q.all(items.map (item, index) => PostManageService.sleep(index * @intervalMs).then(() => PostManageService.revertInbox(item))).then (result) => console.log(result)
      @clear()
      return items

    archive: () -> 
      items = @list()
      $q.all(items.map (item, index) => PostManageService.sleep(index * @intervalMs).then(() => PostManageService.archive(item))).then (result) => console.log(result)
      @clear()
      return items

    done: () -> 
      items = @list()
      $q.all(items.map (item, index) => PostManageService.sleep(index * @intervalMs).then(() => PostManageService.done(item))).then (result) => console.log(result)
      @clear() 
      return items

    remove: (param = {}) -> 
      items = @list()
      $q.all(items.map (item) -> PostManageService.remove(Object.assign({}, item, param))).then (result) => console.log(result)
      @clear() 
      return items

    favorite: () -> 
      items = @list()
      items.forEach (item) -> PostManageService.favorite item
      @clear()
      return items

    unfavorite: () -> 
      items = @list()
      items.forEach (item) -> PostManageService.unfavorite item
      @clear()
      return items
