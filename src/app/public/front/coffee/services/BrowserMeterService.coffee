angular.module "myApp.services"
  .service "BrowserMeterService", ->
    getBrowserDimensions: ->
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
