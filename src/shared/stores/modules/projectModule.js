import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'

const http = httpAnalytics

export const projectModule = {
  state: {
    _projectInfo: {
      name: null,
      projectId: null,
      iconUrl: null
    },
    _favoriteProjectList: [],
    _normalProjectList: []
  },
  mutations: {
    [types.GET_PROJECT_INIT] (state, params) {
      state._projectInfo = params
    },
    [types.GET_PROJECT_LIST] (state, params) {
      state._favoriteProjectList = params.favoriteProjectList
      state._normalProjectList = params.normalProjectList
    }
  },
  actions: {
    [types.GET_PROJECT_INIT] ({ commit }, {projectId, thisComponent}) {
      const url = projectId ? `/project/init/?projectId=${projectId}` : '/project/init'
      http.getPromise(url).then(res => {
        commit(types.GET_PROJECT_INIT, res.data)
      }).catch(err => {
        if (err.response.data.code === 500) {
          if (err.response.data.message === 'Index: 0, Size: 0') {
            thisComponent.notFoundProject()
          }
        }
      })
    },
    [types.GET_PROJECT_LIST] ({ commit }) {
      http.getPromise('/project/sperated/list').then(res => {
        commit(types.GET_PROJECT_LIST, res.data)
      })
    },
    [types.POST_PROJECT_FAVORITE] ({ commit }, { thisComponent, projectId }) {
      http.postPromise(`/project/favorite?projectId=${projectId}`).then(res => {
        thisComponent.getProjectList()
      })
    },
    [types.DELETE_PROJECT_FAVORITE] ({ commit }, { thisComponent, projectId }) {
      http.deletePromise(`/project/favorite/${projectId}`).then(res => {
        thisComponent.getProjectList()
      })
    }
  }
}
