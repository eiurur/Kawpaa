# Filters
angular.module "myApp.filters"
  .filter "interpolate", (version) ->
    (text) ->
      String(text).replace /\%VERSION\%/g, version

  .filter "noHTML", ->
    (text) ->
      if text?
        text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/, '&amp;')

  .filter 'newlines', ($sce) ->
    (text) ->
      $sce.trustAsHtml(if text? then text.replace(/\n/g, '<br />') else '')

  .filter 'trusted', ($sce) ->
    (url) ->
      $sce.trustAsResourceUrl url

  .filter 'trustedHtml', ($sce) ->
    (url) ->
      $sce.trustAsHtml url