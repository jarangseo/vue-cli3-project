import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'

const http = httpAnalytics

export const noticeModule = {
  state: {
    _noticeList: [],
    _noticeInfo: {
      createDate: '',
      title: '',
      content: '',
      isNew: false
    },
    _pageInfo: {
      perPage: 10,
      totalCnt: 0,
      totalPage: 0,
      currentPage: 1,
      pageNumbers: []
    },
    _noticeUrgency: [],
    _isNoticeShow: false
  },
  mutations: {
    [types.GET_NOTICE_INIT] (state) {
      state._noticeInfo = {
        createDate: '',
        title: '',
        content: '',
        isNew: false
      }
    },
    [types.GET_NOTICE_LIST] (state, params) {
      state._noticeList = params.content
      state._pageInfo = {
        perPage: 10,
        totalCnt: 0,
        totalPage: 0,
        currentPage: state._pageInfo.currentPage,
        pageNumbers: []
      }
      state._pageInfo.totalCnt = params.totalElements
      state._pageInfo.totalPage = params.totalPages
      for (let i = 1; i <= state._pageInfo.totalPage; i++) {
        state._pageInfo.pageNumbers.push(i)
      }
    },
    [types.GET_NOTICE] (state, _noticeInfo) {
      state._noticeInfo = _noticeInfo
    },
    [types.GET_NOTICE_URGENCY] (state, _noticeUrgency) {
      state._noticeUrgency = _noticeUrgency.length > 0 ? _noticeUrgency[0] : []
    },
    [types.SET_NOTICE_VISIBILITY] (state, bool) {
      state._isNoticeShow = bool
    }
  },
  actions: {
    [types.GET_NOTICE_LIST] ({ commit }, params) {
      const { page } = params
      http.getPromise(`/board/notice/analytics/list?page=${page}`).then(res => {
        commit(types.GET_NOTICE_LIST, res.data)
      })
    },
    [types.GET_NOTICE] ({ commit }, { id }) {
      commit(types.GET_NOTICE_INIT)
      http.getPromise(`/board/notice/analytics/${id}`).then(res => {
        commit(types.GET_NOTICE, res.data)
      })
    },
    [types.GET_NOTICE_URGENCY] ({ commit }) {
      http.getPromise('/board/notice/urgency').then(res => {
        commit(types.GET_NOTICE_URGENCY, res.data)
      })
    }
  }
}
