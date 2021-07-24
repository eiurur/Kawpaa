angular.module('myApp', [
  'ngRoute'
  'ngAnimate'
  'ngSanitize'
  'ngTouch'
  'infinite-scroll'
  'angulartics'
  'angulartics.google.analytics'
  'myApp.controllers'
  'myApp.filters'
  'myApp.services'
  'myApp.factories'
  'myApp.directives'
])
.value 'THROTTLE_MILLISECONDS', 300
.config ($routeProvider, $locationProvider) ->
  $routeProvider.
    when '/',
      templateUrl: 'partials/main'
    .when '/archive',
      templateUrl: 'partials/main'
    .when '/favorite',
      templateUrl: 'partials/main'
    .when '/done',
      templateUrl: 'partials/main'
    .when '/done/history',
      templateUrl: 'partials/history'
    .when '/post/:pageType/:postObjectId',
      templateUrl: 'partials/post'
      controller: 'PostCtrl'
    .when '/view/:pageType',
      templateUrl: 'partials/view'
      controller: 'ViewCtrl'
    .when '/account',
      templateUrl: 'partials/account'
    .when '/unearth',
      templateUrl: 'partials/unearth'
      controller: 'UnearthCtrl'
    .when '/stats',
      templateUrl: 'partials/stats'
    .when '/stats/ranking/:year',
      templateUrl: 'partials/stats_ranking'
    .when '/find/popular/:term',
      templateUrl: 'partials/find'
      reloadOnSearch: false # $location.searchを使用したときに画面がリロードするのを防ぐ
    .when "/logout",
      redirectTo: "/"
    .when "https://kawpaa.eiurur.xyz/auth/twitter/callback",
      redirectTo: "/"
    .when "https://tk2-207-13331.vs.sakura.ne.jp:9021/auth/twitter/callback",
      redirectTo: "/"
    .when "https://127.0.0.1:9021/auth/twitter/callback",
      redirectTo: "/"
    .otherwise redirectTo: '/'
  $locationProvider.html5Mode true

# FIXME: concatの結合順序バグの対策のためcommonから移動 → [$injector:nomod] Module 'myApp.directives' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.
angular.module "myApp.controllers", []
angular.module "myApp.factories", []
angular.module "myApp.directives", []
angular.module "myApp.filters", []
angular.module "myApp.services", []