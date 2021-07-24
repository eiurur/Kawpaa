angular.module "myApp.services"
.service "ArrayService", ->
  takeRandom: (arr) ->
    arr[Math.floor(Math.random() * arr.length)]
