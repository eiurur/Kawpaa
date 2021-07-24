angular.module "myApp.directives"
  .directive 'searchBox', ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="search-box-container">
        <div class="input-group input-group-sm form search-form">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
          <input type="text" placeholder="Search title or url ..." ng-model="$ctrl.searchWord" ng-model-options="{debounce: 500}" class="form-control search-input"/>
          <span class="input-group-btn"">
            <button class="btn" type="button" ng-click="$ctrl.clear()"><span class="label-with-icon"><i class="fa fa-remove"></i>Clear</span></button>
            <button class="btn" type="button" ng-click="$ctrl.save()"><span class="label-with-icon"><i class="fa fa-save"></i>Save</span></button>
          </span>
        </div>
        
        <div class="favorite-search-words scroll-decoration">
          <span class="word" ng-repeat="word in $ctrl.favoriteSearchWords">
            <span ng-click="$ctrl.applyFavorite($event, word)">{{word}}<span>
            <span class="remove" ng-click="$ctrl.removeFavorite($event, word)"><i class="fa fa-remove"></i></span>
          </span>
        </div>
      </div>
    """
    bindToController: {}
    controller: SearchBoxController
    controllerAs: "$ctrl"

class SearchBoxController
  constructor: (@$scope, @KawpaaStoreService, @KawpaaLocalStorageService) ->
    @init()
    @on()

  init: ->
    favs = @KawpaaLocalStorageService.get('favoriteSearchWords')
    @favoriteSearchWords = if favs then JSON.parse(favs) else []
    @searchWord = @KawpaaStoreService.get('searchWord')
    @$scope.$emit 'SearchBox::search', searchWord: @searchWord

  save: ->
    return if !@searchWord
    @favoriteSearchWords.unshift(@searchWord)
    @favoriteSearchWords = Array.from(new Set(@favoriteSearchWords));
    @KawpaaLocalStorageService.set('favoriteSearchWords', JSON.stringify(@favoriteSearchWords))

  clear: ->
    @searchWord = ''
    return false
  
  applyFavorite: ($event, word) ->
    $event.preventDefault()
    @searchWord = word
    @KawpaaStoreService.set('searchWord', word)
    @$scope.$emit 'SearchBox::search', searchWord: word

  removeFavorite: ($event, word) ->
    $event.preventDefault()
    removed = @favoriteSearchWords.filter (w) => w isnt word
    @favoriteSearchWords = Array.from(new Set(removed));
    @KawpaaLocalStorageService.set('favoriteSearchWords', JSON.stringify(@favoriteSearchWords))

  on: ->
    @$scope.$watch "$ctrl.searchWord", (newData, oldData) =>
      return if newData is oldData
      @KawpaaStoreService.set('searchWord', newData)
      @$scope.$emit 'SearchBox::search', searchWord: newData

SearchBoxController.$inject = ['$scope', 'KawpaaStoreService', 'KawpaaLocalStorageService']
