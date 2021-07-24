angular.module "myApp.services"
  .service "ImageTransitionService", () ->
    post:
      from: 'tiny'
      middle: 'small'
      to: 'medium'
    zoomingPost: 
      from: 'medium'
      middle: ''
      to: 'original'
    stats:
      from:'tiny'
      middle: ''
      to: 'original'