angular.module "myApp.services"
  .service "AuthService", (PromiseService) ->
    fetchSession: ->
      PromiseService.get "/api/sessions"

    loginWithEmail: (data) ->
      PromiseService.post "/auth/signinWithEmail", data

    loginWithToken: (data)->
      PromiseService.post "/auth/signinWithToken", data

    status: isAuthenticated: false

    user: {}
