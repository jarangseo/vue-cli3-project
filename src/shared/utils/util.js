import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import { t } from 'i18next'
import { Spinner } from 'spin.js'
import toastr from 'toastr'
import * as NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import querystring from 'querystring'

export const utilSpinner = {
  spinner: null
}

export const utilSpinners = {
  spinners: {}
}

export const util = {
  getLastSavedReportInfo () {
    let lastReportSetting = JSON.parse(window.localStorage.getItem('lastReportSetting') || '[]')
    return lastReportSetting
  },
  getInitialDateInfo (dateType, to, from) {
    let startDate = ''
    let endDate = ((to) => {
      let end = ''
      switch (to) {
        case 'Now':
          end = moment().format('YYYYMMDDTHHmm')
          break
        case 'SD01':
          end = moment().format('YYYYMMDD')
          break
        case 'SD02':
          end = moment().subtract(1, 'days').format('YYYYMMDD')
          break
        case 'SD03':
          end = moment().format('YYYYMM')
          break
        case 'SD04':
          end = moment().subtract(1, 'months').format('YYYYMM')
          break
      }
      return end
    })(to)
    switch (dateType) {
      case 'DA01':
        startDate = endDate
        break
      case 'DA02':
        startDate = endDate
        break
      case 'DA03':
        startDate = moment(endDate).subtract(from, 'days').format('YYYYMMDD')
        break
      case 'DA04':
        startDate = moment(endDate + '01').subtract(from, 'months').format('YYYYMM')
        break
      case 'DA05':
        startDate = moment(endDate).subtract(from, 'hours').format('YYYYMMDDTHHmm')
        endDate = moment(endDate).format('YYYYMMDDTHHmm')
        break
    }
    return [startDate, endDate]
  },
  isBeforeMaxRange (type, maxRange, dates) {
    // type: dates, months 등 moment 기준 type을 써야함
    let minDate = moment(dates[1]).subtract(maxRange, type)
    return moment(dates[0]).isBefore(minDate)
  },
  sessionChecker () {
    let token = Cookies.get('X-Linegame-UserToken')
    let lgac = Cookies.get('lgac')

    if (!token) {
      return this.consoleSessionChecker()
    }

    this.setCurrentPhase('inhouse')
    return token && lgac
  },
  findGlossary (gl, header) {
    let glossaryObj = {}

    if (gl && header) {
      if (header.isKpiTooltip) {
        _.map(gl['kpi'], e => {
          if (e.tagName === header.originKpiText) {
            glossaryObj = e.glossary
          }
        })
      } else {
        _.map(gl['dimension'], e => {
          if (e.tagName === header.text) {
            glossaryObj = e.glossary
          }
        })
      }
    }
    if (!_.isEmpty(glossaryObj)) {
      return glossaryObj.tooltip
    } else {
      return ''
    }
  },
  consoleSessionChecker () {
    let lgac = Cookies.get('lgac')
    if (lgac) {
      this.setCurrentPhase('open')
    }
    return lgac
  },
  findMenuWithReportId (menuList, reportId) {
    let resObj = {
      depth: 0,
      idx: -1,
      menuId: -1,
      parentMenuId: -1
    }
    let searchThreeDepth = (threeDepthMenuList, oneDepthMenuId, twoDepthMenuId, reportId) => {
      if (threeDepthMenuList && threeDepthMenuList.length > 0) {
        _.map(threeDepthMenuList, (threeDepth, key) => {
          if (Object.keys(threeDepth).indexOf('reportId') > -1) {
            if (threeDepth.reportId === reportId) {
              resObj.depth = 3
              resObj.idx = key
              resObj.menuId = twoDepthMenuId
              resObj.parentMenuId = oneDepthMenuId
            }
          }
        })
      }
    }
    let searchTwoDepth = (twoDepthMenuList, oneDepthMenuId, reportId) => {
      if (twoDepthMenuList && twoDepthMenuList.length > 0) {
        _.map(twoDepthMenuList, (twoDepthMenu, key) => {
          if (Object.keys(twoDepthMenu).indexOf('reportId') > -1) {
            if (twoDepthMenu.reportId === reportId) {
              resObj.depth = 2
              resObj.idx = key
              resObj.menuId = twoDepthMenu.id
              resObj.parentMenuId = oneDepthMenuId
            } else {
              // search three depth
              searchThreeDepth(twoDepthMenu.menuThreeDepthList, oneDepthMenuId, twoDepthMenu.id, reportId)
            }
          } else {
            // search three depth
            searchThreeDepth(twoDepthMenu.menuThreeDepthList, oneDepthMenuId, twoDepthMenu.id, reportId)
          }
        })
      }
    }
    _.map(menuList, (oneDepthMenu, key) => {
      if (Object.keys(oneDepthMenu).indexOf('reportId') > -1) {
        if (oneDepthMenu.reportId === reportId) {
          resObj.depth = 1
          resObj.idx = key
          resObj.menuId = oneDepthMenu.id
        } else {
          // search two depth
          searchTwoDepth(oneDepthMenu.menuTwoDepthList, oneDepthMenu.id, reportId)
        }
      } else {
        // search two depth
        searchTwoDepth(oneDepthMenu.menuTwoDepthList, oneDepthMenu.id, reportId)
      }
    })

    return resObj
  },
  setLanguageAndCurrency (language, currency) {
    Cookies.set('x_growthy_info', { lang: language, currency: currency, service: 'analytis' })
  },
  getLanguageAndCurrency () {
    return Cookies.getJSON('x_growthy_info')
  },
  browserDetectLangAndCurrency () {
    let browserLang = window.navigator.language.split('-')[0].toLowerCase()
    let lang = 'en'
    let currency = 'usd'
    switch (browserLang) {
      case 'ko':
        lang = 'kr'
        currency = 'krw'
        break
      case 'ja':
        lang = 'jp'
        currency = 'jpy'
        break
    }
    return {lang, currency}
  },
  setCurrentPhase (phase) {
    window.localStorage.setItem('X-GROWTHY-PHASE', phase)
  },
  kerberosChecker () {
    let isProbeUser = Cookies.get('Probe-UserToken')
    return isProbeUser
  },
  /* http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
  generateUUID () {
    let d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now() // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  },
  unixtimeToDate (unixtime) {
    return moment.unix(unixtime / 1000).format('YYYY-MM-DD hh:mm:ss a')
  },
  stringLengthComma (value) {
    if (!value) return 0
    return value.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  numberOnlyEvent (e) {
    if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(e.key) >= 0) {
      e.preventDefault()
      return false
    }
    /* if (e.keyCode > 128) {
      e.preventDefault()
      return false
    } */
  },
  numberDeleteCommas (value) {
    return Number(value.replace(/,/g, ''))
  },
  numberWithCommas (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  kpiTOClass (str) {
    let result = 'js-'
    for (let i in str) {
      result += str.charCodeAt(i)
    };
    return result
  },
  capitalizeFirstLetter (string) {
    if (!string) { return }
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  getI18nextLanguage () {
    const i18nextLanguage = localStorage.getItem('i18nextLanguage')
    if (i18nextLanguage) {
      return i18nextLanguage
    }
    const userLang = navigator.language || navigator.userLanguage
    let lng = 'en'
    switch (userLang.toLowerCase()) {
      case 'ko':
      case 'kr':
      case 'ko-kr':
        lng = 'kr'
        break
      case 'ja':
      case 'jp':
      case 'ja-jp':
        lng = 'jp'
        break
      default:
    }
    return lng
  },
  t (str) {
    return t(str)
  },
  toastr () {
    return toastr
  },
  spinner (id, options) {
    if (!options) {
      options = {
        scale: 0.75
      }
    }
    utilSpinner.spinner = new Spinner({ scale: options.scale }).spin(document.getElementById(id))
    return utilSpinner.spinner
  },
  spinners (id) {
    utilSpinners[id] = new Spinner({ scale: 0.5 }).spin(document.getElementById(id))
    return utilSpinners[id]
  },
  findValue (obj, key, kString, vString) {
    const KEY = kString || 'key'
    const VALUE = vString || 'value'
    return (_.findIndex(obj, [KEY, key]) >= 0 && obj[_.findIndex(obj, [KEY, key])][VALUE]) || ''
  },
  findObject (obj, key, kString) {
    const KEY = kString || 'key'
    return (_.findIndex(obj, [KEY, key]) >= 0 && obj[_.findIndex(obj, [KEY, key])]) || {}
  },
  antiXSS (str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  },
  NProgressStart () {
    NProgress.start()
  },
  NProgressDone () {
    NProgress.done()
  },
  querystringParse (query) {
    return querystring.parse(query)
  },
  querystringStringify (query) {
    return querystring.stringify(query)
  },
  querystringStringifyParse (query) {
    return querystring.parse(querystring.stringify(query))
  },
  querystringParseStringify (query) {
    return querystring.stringify(querystring.parse(query))
  },
  striphtml (value) {
    let div = document.createElement('div')
    div.innerHTML = value
    let text = div.textContent || div.innerText || ''
    return text
  },
  dataDisplayFormatter (setting, data) {
    let formated = data + ''
    if (formated === 'null') {
      formated = '-'
    } else if (setting && setting.type) {
      switch (setting.type) {
        case 'DATE':
          if (setting.split === 'N' && setting.formatDateTimeInDb && setting.formatDateTime && (setting.formatDateTimeInDb !== setting.formatDateTime)) {
            formated = moment(data, setting.formatDateTimeInDb).format(setting.formatDateTime)
          }
          break
        case 'STRING':
          break
        case 'NUMBER':
          formated = Number(formated)
          if (!isNaN(Number(setting.formatDecimalAccuracy))) {
            formated = formated.toFixed(Number(setting.formatDecimalAccuracy))
          }
          if (setting.formatThousandsSeparator) {
            formated = this.thousandsSeparator(formated)
          }
          break
        default:
          break
      }
      if (setting.prefix) {
        formated = setting.prefix + formated
      }
      if (setting.suffix) {
        formated += setting.suffix
      }
    }
    return formated
  },
  descStringCompare (a, b) {
    const genreA = a['text'].toUpperCase()
    const genreB = b['text'].toUpperCase()
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison
  },
  ascStringCompare (a, b) {
    const genreA = a['text'].toUpperCase()
    const genreB = b['text'].toUpperCase()
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison * -1
  },
  ascNumberCompare (a, b) {
    const genreA = a['text'] === '-' ? -1 : a['text'] * 1
    const genreB = b['text'] === '-' ? -1 : b['text'] * 1
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison * -1
  },
  descNumberCompare (a, b) {
    const genreA = a['text'] === '-' ? -1 : a['text'] * 1
    const genreB = b['text'] === '-' ? -1 : b['text'] * 1
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison
  },
  descDateCompare (a, b) {
    const genreA = moment(a['text']).valueOf()
    const genreB = moment(b['text']).valueOf()
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison
  },
  ascDateCompare (a, b) {
    const genreA = moment(a['text']).valueOf()
    const genreB = moment(b['text']).valueOf()
    let comparison = 0
    if (genreA < genreB) {
      comparison = 1
    } else if (genreA > genreB) {
      comparison = -1
    }
    return comparison * -1
  },
  replaceWords (string, wordsArray) {
    let newStr = string
    wordsArray.forEach((item) => {
      newStr = newStr.replace(Object.keys(item)[0], Object.values(item)[0])
    })
    return newStr
  },
  isWindow () {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf('window') !== -1
  },
  isIE () {
    return /(?:\b(MS)?IE\s+|\bTrident\/7\.0;.*\s+rv:)(\d+)/.test(window.navigator.userAgent)
  }
}

// toastr.options.closeButton = true
toastr.options.hideDuration = 200
toastr.options.positionClass = 'toast-top-center'
