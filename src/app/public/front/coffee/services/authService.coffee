angular.module "myApp.services"
  .service "AuthService", (PromiseService) ->
    url: "/api/sessions"
    
    fetchSession: ->
      PromiseService.get this.url

    status: isAuthenticated: false

    user: {}
