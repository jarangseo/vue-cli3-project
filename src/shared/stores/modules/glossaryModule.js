import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'
import { util } from '@/shared/utils/util'

const http = httpAnalytics

export const glossaryModule = {
  state: {
    _glossaryList: [],
    _alphabetList: [],
    _glossaryInitCode: {},
    _glossaryInfo: {
      id: null,
      name: '',
      tooltip: '',
      description: ''
    }
  },
  mutations: {
    [types.GET_GLOSSARY] (state, _glossaryInfo) {
      state._glossaryInfo = _glossaryInfo
    },
    [types.GET_GLOSSARY_LIST] (state, _glossaryList) {
      state._alphabetList = _glossaryList.alphabetList
      state._glossaryList = _glossaryList.glossaryList
    },
    [types.GET_GLOSSARY_INIT_CODES] (state, _glossaryCodes) {
      state._glossaryInitCode = _glossaryCodes
    }
  },
  actions: {
    [types.GET_GLOSSARY] ({ commit }, id) {
      http.getPromise(`/board/glossary/analytics/${id}`).then(res => {
        commit(types.GET_GLOSSARY, res.data)
      })
    },
    [types.GET_GLOSSARY_LIST] ({ commit }, type) {
      http.getPromise(`/board/glossary/analytics/common/list/?type=${type}`).then(res => {
        commit(types.GET_GLOSSARY_LIST, res.data)
      })
    },
    [types.GET_GLOSSARY_INIT_CODES] ({ commit }) {
      http.getPromise(`/board/glossary/init/code`).then(res => {
        commit(types.GET_GLOSSARY_INIT_CODES, res.data.glossaryTypeGroupList)
      }, err => {
        util.toastr().error(err.response.data.message)
      })
    }
  }
}
