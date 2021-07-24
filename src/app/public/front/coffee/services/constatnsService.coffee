angular.module "myApp.services"
  .service "ConstantsService", ->

    DURING_LIST: {
      items: do -> 
        LAUNCHED_YEAR = 2015 # サービス開始年
        currentYear = (new Date()).getFullYear()
        selectedYears = [currentYear..LAUNCHED_YEAR].map (year) -> {k: "#{year}年", v: year}
        [{k: '全期間', v: 'all'}].concat(selectedYears)
      selected: {k: '全期間', v: 'all'}
    }

    FILTER_TYPE_LIST: {
      items: [
        {k: '全て', v: 'all'}
        {k: 'Image', v: 'image'}
        {k: 'Link', v: 'link'}
        {k: 'Video', v: 'video'}
        {k: 'Text', v: 'text'}
      ]
      selected: {k: '全て', v: 'all'}
    }

    SORT_TYPE_LIST: {
      items: [
        {k: '抜いた数が多い順', v: 'numDoneDesc', t: 'done,favorite'}
        {k: '抜いた数が少ない順', v: 'numDoneAsc', t: 'done,favorite'}
        {k: '更新が新しい順', v: 'updatedAtDesc', t: 'all'}
        {k: '更新が古い順', v: 'updatedAtAsc', t: 'all'}
        {k: '登録が新しい順', v: 'createdAtDesc', t: 'all'}
        {k: '登録が古い順', v: 'createdAtAsc', t: 'all'}
      ]
      selected: {k: '更新が新しい順', v: 'updatedAtDesc'}
    }