# Cron

crontabから各種batch.jsを呼び出しても失敗するため、`node-cron`を代わりに使用。


## ImageCrawlerCron

収集対象は前日、前週、前月とする。

### Daily

毎日 3:05, 12:05に開始

### Weekly

毎週月曜 5:15, 15:10に開始

### Monthly

毎月1日 AM 7:5に開始
