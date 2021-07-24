angular.module "myApp.directives"
  .directive "fileModel", ($parse, PromiseService) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      model = $parse(attrs.fileModel);
      modelSetter = model.assign;
      element.on 'change', (e) ->
        scope.$apply(()->
          file = element[0].files[0]
          modelSetter(scope, file);
        )
