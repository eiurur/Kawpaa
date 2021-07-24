angular.module "myApp.directives"
  .directive "howToSaveContents", ->
    restrict: 'E'
    scope: {}
    template: """
      <h3 class="description__section">リンクの追加方法</h3>
      <div class="description">リンク(サイトのURL、画像のURL)の追加にはChrome Extensionを利用する必要があります。</div>
      <div class="description">① 以下のサイトからChrome Extensionをインストールしてください。<br>
        <p></p>
        <p><a href="https://github.com/eiurur/Save-to-Kawpaa" target="_blank">Save to Kawpaa - Github<i class="fa fa-external-link zurui-icon-right"></i></a></p>
      </div>
      <div class="description">② つぎに、以下のトークンをChrome Extensionのオプションページのフォームに入力してください。<br>
        <pre><code>{{user.twitter_token}}</code></pre>
      </div>
      <div class="description">Chrome Extensionのアイコンを右クリックし、メニューを開きます。<br/>オプションをクリックするとオプションページが開かれます。<img src="./front/images/description/open_option_kawpaa.png" class="img-responsive"/></div>
      <div class="description">③ トークンをコピペしてください。<img src="./front/images/description/option_kawpaa.png" class="img-responsive"/></div>
      <div class="description">これで準備は完了です。</div>
      <div class="description">気に入ったサイトのURLや画像をドンドンストックしていき、QOLを向上させていきましょう。<br></div>
    """