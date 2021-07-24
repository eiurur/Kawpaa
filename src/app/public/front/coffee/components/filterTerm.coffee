# angular.module "myApp.directives"
#   .directive 'filterTerm', ->
#     restrict: 'E'
#     scope: {}
#     template: """
#     <div class="checkbox__container"">
#         <li>2015</li>
#         <li>2016</li>
#         <li data-checked="true">2017</li>
#     </div>
#     """
#     bindToController: {}
#     controller: FilterTermController
#     controllerAs: "$ctrl"

# class FilterTermController
#   constructor: (@$scope) ->
#     @on()

#   on: ->
#   #   @$scope.$watch "$ctrl.searchWord", (newData, oldData) =>
#   #     console.log newData, oldData
#   #     return if newData is oldData
#   #     @$scope.$emit 'SearchBox::search', searchWord: newData

# FilterTermController.$inject = ['$scope']
