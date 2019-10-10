import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'

export const commonModule = {
  state: {
    _me: {
      createDate: null,
      userEmail: '',
      userKey: '',
      userName: '',
      language: '',
      currency: ''
    },
    _userIsLogin: false,
    isLangLoad: false,
    _activeModal: '',
    _fullScreenPivotIdx: -1,
    _lang: {
      totalInfoData: {
        currencyCodeList: [],
        languageCodeList: [],
        languageSet: []
      },
      prestoErrorMessage: {
        en: 'You cannot receive data from the cluster.',
        kr: '클러스터로부터 데이터를 받을 수 없습니다.',
        jp: 'クラスタからのデータを受信することができません。'
      },
      dataBySelectedLang: {
        'analytics_gnb_profile_language': 'Language Settings',
        'analytics_error_msg_wrongpage': "The page doesnt' exist.",
        'analytics_handler_msg_nofilter': 'No Filter is set.',
        'analytics_gnb_profile_currency': 'Currency Settings',
        'analytics_error_msg_noproject': 'No project is using GROWTHY.',
        'analytics_error_msg_nocategory': 'You can use GROWTHY Analytics after setting Service Category in GROWTHY Map.',
        'analytics_error_msg_deploylogauth': '* Only users with Data Manager authority can set the Map Category.',
        'analytics_error_msg_noaccess': 'No permission to access this project.\nPlease contact administrator.',
        'analytics_handler_msg_maxdate': 'Max {@max_period} can be set',
        'analtyics_error_msg_nocategoryauth': '* Only users with Data Manager authority can set the Map Category.',
        'analytics_error_msg_deployloglist': 'GROWTHY Map Log that is needs to be deployed',
        'analytics_object_msg_nodata': 'No data can be found by the query criteria.',
        'analytics_error_msg_deploylog': 'You can view this report after deploying the following logs in GROWTHY Map.',
        'anaytics_lnb_msg_noresult': 'No results.',
        'analytics_pivotset_msg_nokpi': 'No KPI is set.',
        'analytics_gnb_profile_account': 'Account Management',
        'analytics_gnb_profile_savesetting': 'Save the last settings of Report'
      }
    },
    isShowToTop: false,
    isFullScreenOpened: false
  },
  mutations: {
    [types.GET_MY_INFO] (state, me) {
      state._me = me
      state.cookieUserIsLogin = true
    },
    [types.SET_ACTIVE_MODAL] (state, str) {
      state._activeModal = str
    },
    [types.GET_LANG_DATA] (state, langData) {
      state._lang.totalInfoData = langData
      state.isLangLoad = true
    },
    [types.SET_INFO_BY_LANG] (state, data) {
      state._lang.dataBySelectedLang = data
    },
    [types.SET_SHOW_TOP] (state, bool) {
      state.isShowToTop = bool
    },
    [types.TOGGLE_FULL_PIVOT] (state, {bool, pivotIdx}) {
      state.isFullScreenOpened = bool
      state._fullScreenPivotIdx = pivotIdx
    }
  },
  actions: {
    [types.GET_MY_INFO] ({ commit }) {
      httpAnalytics.getPromise('/user/me').then(res => {
        commit(types.GET_MY_INFO, res.data)
      })
    },
    [types.POST_MY_INFO] ({ commit }, params) {
      httpAnalytics.postPromise('/user/me', params).then(res => {
        this.dispatch(types.GET_MY_INFO)
      })
    },
    [types.USER_LOGIN_SET] ({ commit }, bool) {
      this.state.common._userIsLogin = bool
    },
    [types.GET_LANG_DATA] ({ commit }) {
      httpAnalytics.getPromise('/analytics/initData').then(res => {
        commit(types.GET_LANG_DATA, res.data)
      })
    }
  }
}
