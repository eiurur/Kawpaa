angular.module "myApp.factories"
  .factory 'Image', ->
    class Image
      constructor: (@width, @height, @from, @to) ->

    Image