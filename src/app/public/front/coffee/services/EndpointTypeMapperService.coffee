angular.module "myApp.services"
  .service "EndpointTypeMapperService", ->
    types: 
      inbox: 'inboxes'
      archive: 'archives'
      done: 'dones'
      history: 'histroies'
    get: (type) ->
      console.log type
      console.log @types
      console.log @types[type]
      unless @types[type] # inboxページはtypeがnull
        return @types.inbox
      else if @types[type]
        return @types[type]
      else 
        throw new Error("#{type} is not accpepted")