angular.module "myApp.services"
  .service "TimeService", ->
    type:
      DAYS: 'days'
      WEEKS: 'weeks'
      MONTHS: 'months'
      YEARS: 'years'

    normalizeDate: (term, date) ->
      return null unless date 
      switch term
        when this.type.DAYS then return moment(date).format('YYYY-MM-DD')
        when this.type.WEEKS then return moment(date).format('YYYY-MM-DD')
        when this.type.MONTHS then return moment(date).date('1').format('YYYY-MM-DD')
        else return moment(date).format('YYYY-MM-DD')

    changeDate: (term, date, amount) ->
      return null unless date 
      switch term
        when this.type.DAYS then return moment(date).add(amount, 'days').format('YYYY-MM-DD')
        when this.type.WEEKS then return moment(date).add(amount, 'weeks').format('YYYY-MM-DD')
        when this.type.MONTHS then return moment(date).add(amount, 'months').date('1').format('YYYY-MM-DD')
        else return moment().format('YYYY-MM-DD')

    agos: () ->
      LAUNCHED_YEAR = 2015 # サービス開始年
      currentYear = (new Date()).getFullYear()
      diffYear = currentYear - LAUNCHED_YEAR
      return [1..diffYear]