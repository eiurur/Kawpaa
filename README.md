# Kawpaa

    Web service to assist your masturbation life.

<br>

# 起動に必要なもの

- <a href="https://git-scm.com/" target="_blank">Git</a>
- <a href="https://www.docker.com/products/docker-desktop" target="_blank">Docker</a>

<br>

# 想定環境

- Windows10 Home

<br>

# 起動手順

## 0. 事前準備

Git および Docker をインストールして、git コマンドおよび docker-compose コマンドが実行できるようにしてください。

<details>
<summary>詳細</summary>

0-1. Git をインストールします(すでにインストール済みであれば作業不要です)。以下のリンクからインストーラをダウンロードしてください。

> <a href="https://git-scm.com/" target="_blank">Git</a>

<img src="media/git_1.jpeg" alt="git_1" width="640" height="auto">

<br>

0-2. ダウンロードしたインストーラを実行してインストールします。(初期設定を変更する必要は特になく Next ボタンを押下していくだけで大丈夫です)

<img src="media/git_2.png" alt="git_1" width="640" height="auto">
<img src="media/git_3.png" alt="git_1" width="640" height="auto">
<img src="media/git_4.png" alt="git_1" width="640" height="auto">
<img src="media/git_5.png" alt="git_1" width="640" height="auto">
<img src="media/git_6.png" alt="git_1" width="640" height="auto">
<img src="media/git_7.png" alt="git_1" width="640" height="auto">
<img src="media/git_8.png" alt="git_1" width="640" height="auto">
<img src="media/git_9.png" alt="git_1" width="640" height="auto">
<img src="media/git_10.png" alt="git_1" width="640" height="auto">
<img src="media/git_11.png" alt="git_1" width="640" height="auto">
<img src="media/git_12.png" alt="git_1" width="640" height="auto">
<img src="media/git_13.png" alt="git_1" width="640" height="auto">
<img src="media/git_14.png" alt="git_1" width="640" height="auto">
<img src="media/git_15.png" alt="git_1" width="640" height="auto">
<br>

0-3. 以下のリンクを参考に Docker をインストールしてください。(すでにインストール済みであれば作業不要です)

> <a href="https://qiita.com/zaki-lknr/items/db99909ba1eb27803456" target="_blank">Windows 10 Home への Docker Desktop (ver 3.0.0) インストールが何事もなく簡単にできるようになっていた (2020.12 時点) - Qiita</a>

</details>

<br>

## 1. TwitterAPI の利用申請

以下のリンクから Twitter API の利用申請をして、`Callback URLs`の登録および`Consumer Key`と`Consumer Secret`の取得が必要です。  
もし、アプリケーションをローカルに立ち上げる場合は、申請時に`Callback URLs`の入力欄に`https://127.0.0.1:9021/auth/twitter/callback`を指定してください。

> <a href="https://developer.twitter.com/en" target="_blank">Twitter Developer Platform</a>

<details>
<summary>詳細</summary>
1-1. 下記リンクの手順を参考に上記3点を登録or取得します。

> <a href="https://www.itti.jp/web-direction/how-to-apply-for-twitter-api/" target="_blank">2021 年度版 Twitter API 利用申請の例文から API キーの取得まで</a>

※ また、本 README における以下の単語とリンク先の単語は次のように対応しています。

- `Consumer Key` ⇔ `API key`
- `Consumer Secret` ⇔ `API Secret key`
- `Callback URLs` ⇔ `Callback URLs`

</details>

<br>

## 2. プロジェクトの clone

    $ git clone https://github.com/eiurur/Kawpaa.git
    $ cd Kawpaa

<details>
<summary>詳細</summary>

2-1. git-bash を起動してください。

<img src="media/git-bash.png" alt="git_1" width="640" height="auto">

<br>

2-2. プロジェクトの clone、ディレクトリの移動を行ってください。

    $ git clone https://github.com/eiurur/Kawpaa.git
    $ cd Kawpaa

<img src="media/project.png" alt="git_1" width="640" height="auto">

</details>

<br>

## 3. 設定の変更

`.env.docker.sample`を`.env.docker`に改名します。

    $ mv .env.docker.sample .env.docker

`.env.docker`をエディタで開いて、`TW_CK`、`TW_CS`、`CALLBACK_URL`をそれぞれ ① で得られた値に変更してください。

**変更前**

```yaml
- TW_CK=<CHANGE HERE...Twitter consumer key>
- TW_CS=<CHANGE HERE...Twitter consumer secret>
- CALLBACK_URL=<CHANGE HERE...Twitter callback url>
```

**変更後(例)**

```yaml
- TW_CK=XXX1234567890ABCDEFGHIXXX
- TW_CS=ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWX
- CALLBACK_URL=https://127.0.0.1:9021/auth/twitter/callback
```

<details>
<summary>詳細</summary>

3-1. `.env.docker.sample`を`.env.docker`に改名してください。

> mv .env.docker.sample .env.docker

<img src="media/env-1.png" alt="git_1" width="640" height="auto">

3-2. `.env.docker`の内容のうち、`TW_CK`、`TW_CS`、`CALLBACK_URL`をそれぞれ ① で得られた値に変更してください。notepad コマンドを実行するとメモ帳が開きます。変更が終わりましたら保存してメモ帳を閉じてください。

> notepad .env.docker

**変更前**

<img src="media/env-2.png" alt="git_1" width="640" height="auto">

**変更後(例)**

<img src="media/env-3.png" alt="git_1" width="640" height="auto">

</details>

<br>

## 4. アプリケーションの起動

    $ docker-compose up -d --build

<details>
<summary>詳細</summary>

4-1. `docker-compose up -d --build`を実行してアプリケーションを起動してください。

**起動開始**

<img src="media/start-docker-1.png" alt="git_1" width="640" height="auto">

**起動完了後**

<img src="media/start-docker-2.png" alt="git_1" width="640" height="auto">

4-2. タスクバーの docker アイコンを右クリックして`Dashboard`メニューを左クリックし、kawpaa コンテナが立ち上がっていることを確認してください。

<img src="media/start-docker-3.png" alt="git_1" width="640" height="auto">
<img src="media/start-docker-4.png" alt="git_1" width="640" height="auto">

</details>
<br>

## 5. URL にアクセス

ブラウザを起動して <a href="https://127.0.0.1:9021/" target="_blank">https://127.0.0.1:9021/</a> にアクセスします

<details>
<summary>詳細</summary>

5-1. ブラウザを起動して`https://127.0.0.1:9021`にアクセスします。`詳細設定`>`127.0.0.1にアクセスする(安全ではありません)`をクリックしてください。Kawpaa のトップ画面が表示されたら作業完了です。

<img src="media/open-1.png" alt="git_1" width="640" height="auto">
<img src="media/open-2.png" alt="git_1" width="640" height="auto">

</details>
<br>

# その他

- コンテンツの登録には Chrome Extension が必要です。<a href="https://github.com/eiurur/Save-to-Kawpaa">こちらから</a>最新版をダウンロードしてください。
- ローカルで立ち上げず、VPS やクラウドで立ち上げる場合は、上記手順ならびにソースコードの`https://127.0.0.1:9021`を各自のドメインに置き換えてください。
  - また、<a href="https://github.com/eiurur/Save-to-Kawpaa">ChromeExtension</a>も同様の置き換えを行った上で再ビルドが必要ですのでご注意ください。
    <br>

# 開発方法

WIP
