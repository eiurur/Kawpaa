# Kawpaa

    Web service to assist your masturbation life.

<br>

# 起動に必要なもの

- <a href="https://docs.docker.com/get-docker/">Docker</a>

<br>

# 起動手順

## ① TwitterAPI の利用申請

以下のリンクから Twitter API の利用申請をして、`Callback URLs`の登録および`Consumer Key`と`Consumer Secret`の取得が必要です。  
もし、アプリケーションをローカルに立ち上げる場合は、申請時に`Callback URLs`の入力欄に`https://127.0.0.1:9021/auth/twitter/callback`を指定してください。

> <a href="https://developer.twitter.com/en">Twitter Developer Platform</a>

## ② プロジェクトの clone

    $ git clone https://github.com/eiurur/Kawpaa.git
    $ cd Kawpaa

## ③ 設定の変更

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

## ④ アプリケーションの起動

    $ docker-compose up -d

## ⑤ URL にアクセス

<a href="https://127.0.0.1:9021/">Kawpaa</a>

<br>

# その他

- コンテンツの登録には Chrome Extension が必要です。<a href="https://github.com/eiurur/Save-to-Kawpaa">こちらから</a>最新版をダウンロードしてください。

<br>

# 開発方法

WIP
