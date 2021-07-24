# Services
angular.module "myApp.services"
  .service 'NotifyService', ->
    success: (text) ->
      notie.alert(
        type: 'success' 
        text: text 
        time: 1.5
      )

    warning: (text) ->
      notie.alert(
        type: 'warning' 
        text: text 
        time: 1.5
      )

    error: (text) ->
      notie.alert(
        type: 'error' 
        text: text 
        time: 1.5
      )

    infomation: (text) ->
      notie.alert(
        type: 'info' 
        text: text 
        time: 1.5
      )
