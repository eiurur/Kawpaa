# 命名規則

write here ...

<br><br>

### shemes

DB の構造情報

### provider

### repository

<br><br>

# モデル

## User

ユーザ情報を保持するモデル。

## Post

Save to Ona it Later から登録された画像を保持するモデル。

## DonePost

抜いた画像の情報を保持するモデル。

Post に回数を増やしたモデル。

## DoneHistory

抜いた画像の履歴を保持するモデル。

`DonePost`は抜いた情報を記録するが、回数や抜いた日付は上書きしていくため、これまでの軌跡を辿ることができない。

なので、履歴用のモデルを用意。
