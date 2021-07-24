angular.module "myApp.services"
  .service "CommandService", ->
    commands: [
      {
        name: 'アーカイブに保存する'
        key: 'a'
      }
      {
        name: 'Inboxに保存する / Inboxに戻す'
        key: 'i'
      }
      {
        name: '射精した'
        key: 'd'
      }
      {
        name: 'お気に入りに追加する / お気に入りから削除する'
        key: 'f'
      }
      {
        name: '新しいウィンドウで開く'
        key: 'o'
      }
      {
        name: '削除する'
        key: 'r'
      }
      {
        name: '拡大/縮小'
        key: 'z'
      }
      {
        name: '次のポストに移動する'
        key: 'j, →'
      }
      {
        name: '前のポストに移動する'
        key: 'k, ←'
      }
      {
        name: '画像を右に90°回転させる'
        key: 'ctrl + →'
      }
      {
        name: '画像を左に90°回転させる'
        key: 'ctrl + ←'
      }
      {
        name: '閉じる'
        key: 'Esc, q'
      }
      {
        name: '期間の変更'
        key: 'p p'
      }
      {
        name: 'フィルタタイプ切り替え'
        key: 't t'
      }
      {
        name: 'ソート切り替え'
        key: 's s'
      }
      {
        name: 'ショートカットキーのヘルプを開く / 閉じる'
        key: 'h'
      }
    ]
