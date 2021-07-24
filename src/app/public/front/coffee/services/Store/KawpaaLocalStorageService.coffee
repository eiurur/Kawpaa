# Services
angular.module "myApp.services"
  .service "KawpaaLocalStorageService", (LocalStorageService) ->
    set: (key, value) -> LocalStorageService.set "Kawpaa:#{key}", value
    get: (key) -> LocalStorageService.get "Kawpaa:#{key}"
    isEmpty: (key) -> LocalStorageService.get("Kawpaa:#{key}") is null
