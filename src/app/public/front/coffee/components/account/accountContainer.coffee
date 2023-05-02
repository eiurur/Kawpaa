angular.module "myApp.directives"
  .directive "accountContainer", ->
    restrict: 'E'
    scope: {}
    template: """
      <div class="col-md-12">
        <div class="section">
          <div class="dashboard">
            <div class="col-md-6">
              <div class="user-info__container">

                <h3>プロフィール</h3>
                <div class="profile__container">
                  <div class="media">
                    <a href="https://www.twitter.com/{{$ctrl.user.screenName}}" target="_blank" class="pull-left">
                      <img ng-src="{{$ctrl.user._json.profile_image_url_https}}" img-preload="img-preload" class="media-object icon-img fade"/>
                    </a>
                    <div class="media-body">
                      <h4 class="media-heading">
                        <span class="name">{{$ctrl.user.name}}</span>
                        <span class="screen-name">@{{$ctrl.user.screenName}}</span>
                      </h4>
                      <span ng-bind-html="$ctrl.user.description | newlines"></span>
                    </div>
                  </div>
                </div>

                <h3>トークン</h3>
                <pre><code>{{$ctrl.user.accessToken}}</code></pre>

                <hr class="divider"/>
                <div class="import-export">
                  <div class="download-form">
                    <div></div>
                    <button type="button" ng-click="$ctrl.download()" class="btn btn-info download" ng-class="{disabled: $ctrl.isDownloading}">
                      <i class="fa fa-circle-o-notch fa-spin"></i>
                      <span>登録情報のエクスポート</span>
                    </button>
                  </div>
                  <div class="upload-form">
                    <input type="file" accept=".json" file-model="$ctrl.file"  ng-disabled="$ctrl.isUploading">
                    <button type="button" ng-click="$ctrl.upload()" class="btn btn-info upload" ng-class="{disabled: $ctrl.isUploading}">
                      <i class="fa fa-circle-o-notch fa-spin"></i>
                      <span>登録情報のインポート</span>
                    </button>
                  </div>
                </div>
                
                <hr class="divider"/>
                <a href="https://twitter.com/kawpaa" target="_blank" class="btn btn-info">ご意見・お問い合わせ</a>
                <a href="/logout" target="_self" class="btn btn-danger">ログアウト</a>
                
              </div>
            </div>

            <div class="col-md-6">
              <div class="user-info__container">
                <h3>ショートカットキー一覧</h3>
                <h5>
                画像の拡大中に使えるショートカットキーの一覧です。<br/>
                ページによって利用できるショートカットキーが異なります。
                </h5>
                <div ng-repeat="command in $ctrl.commands">
                  <h5>{{command.name}}</h5>
                  <pre><code>{{command.key}}</code></pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    """
    bindToController: {
    }
    controller: AccountController
    controllerAs: "$ctrl"

class AccountController
  constructor: (AuthService, CommandService, @NotifyService, @PromiseService) ->
    @user = AuthService.user
    @commands = CommandService.commands
    @file = null
    @isDownloading = false
    @isUplading = false

  download: ->
    @isDownloading = true
    @PromiseService.get("/api/export")
    .then (response) =>
      json = response.data
      resultJson = JSON.stringify(json);
      link = document.createElement("a");
      link.download = "kawpaa.json";
      link.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
      link.dataset.downloadurl = ["text/plain", link.download, link.href].join(":");
      link.click();
      @isDownloading = false
      @NotifyService.success 'エクスポートに成功しました'
    .catch (err) =>
      @isDownloading = false
      @NotifyService.error 'エクスポートに失敗しました'

  upload: ->
    reader = new FileReader();
    reader.onload = (event) =>
      json = JSON.parse(event.target.result)
      if !json.record then throw new Error("invalid record")
      @isUploading = true
      @PromiseService.post("/api/import", {record: json.record}) 
      .then (response) =>
        @isUploading = false
        @NotifyService.success 'インポートに成功しました'
      .catch (err) =>
        @isUploading = false
        @NotifyService.error 'インポートに失敗しました'
    reader.readAsText(@file);

  fileChanged: (file) ->
    console.log(file)

AccountController.$inject = ['AuthService', 'CommandService',  'NotifyService', 'PromiseService']