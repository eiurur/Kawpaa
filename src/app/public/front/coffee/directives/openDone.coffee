angular.module "myApp.directives"
  .directive 'openDone', ($location) ->
    restrict: 'A'
    scope:
      posts: '='
    link: (scope, element, attrs) ->
      element.on 'click', ->
        console.log scope.posts
        posts = scope.posts
        images = posts.filter((post) -> post.donePost.type is 'image').map((image) -> image.donePost._id).join(',')
        links = posts.filter((post) -> post.donePost.type is 'link').map((link) -> link.donePost._id).join(',')
        videos = posts.filter((post) -> post.donePost.type is 'video').map((video) -> video.donePost._id).join(',')
        texts = posts.filter((post) -> post.donePost.type is 'text').map((text) -> text.donePost._id).join(',')
        size = "width=#{screen.availWidth},height=#{screen.availHeight}"

        console.log images, links, videos, texts
        if !!images
          window.open "/view/done?images=#{images}", '', size
        if !!links
          window.open "/view/done?&links=#{links}", '', size
        if !!videos
          window.open "/view/done?videos=#{videos}", '', size
        if !!texts
          window.open "/view/done?texts=#{texts}", '', size
