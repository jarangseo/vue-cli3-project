import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'

const http = httpAnalytics

export const menuModule = {
  state: {
    _menuList: [],
    _activeSecondMenu: {},
    _oneDepthMenuName: '',
    _twoDepthMenuInfo: {
      type: 'TA02'
    },
    menuId: -1,
    _isOpenMenu: false,
    _currentOneDepthMenuId: -1,
    isTransitionEnd: false
  },
  mutations: {
    [types.GET_MENU_LIST] (state, data) {
      let defaultSecondMenu = -1
      state.menuId = data.id
      state._menuList = data.menuOneDepthList || []
      if (state._currentOneDepthMenuId > -1 && state._menuList.length > 0) {
        state._oneDepthMenuName = state._menuList.filter(o => {
          return o.id === state._currentOneDepthMenuId
        })[0].name
      }
      data.menuOneDepthList.forEach(menu => {
        if (menu.menuTwoDepthList && menu.menuTwoDepthList.length > 0) {
          defaultSecondMenu = menu.menuTwoDepthList[0]
        }
      })
      this.commit(types.SET_ACTIVE_MENU, defaultSecondMenu)
    },
    [types.SET_ACTIVE_MENU] (state, data) {
      state._activeSecondMenu = data
    },
    [types.GET_TWO_DEPTH_MENU_INFO] (state, data) {
      state._twoDepthMenuInfo = data
      state._currentOneDepthMenuId = data.menuOneDepthId
      if (state._currentOneDepthMenuId > -1 && state._menuList.length > 0) {
        state._oneDepthMenuName = state._menuList.filter(o => {
          return o.id === state._currentOneDepthMenuId
        })[0].name
      }
    },
    [types.INIT_MENU_LIST] (state) {
      state.menuId = -1
      state._menuList = []
    },
    [types.TOGGLE_LEFT_MENU] (state, boolean) {
      state._isOpenMenu = boolean
    },
    [types.TRANSITION_END] (state) {
      state.isTransitionEnd = !state.isTransitionEnd
    }
  },
  actions: {
    [types.GET_MENU_LIST] ({ commit }, { projectId, thisComponent }) {
      this.state.menu._menuList = []
      this.state.menu._currentOneDepthMenuId = -1
      http.getPromise(`/menu/list/${projectId}`).then(res => {
        commit(types.GET_MENU_LIST, res.data)
        thisComponent.goToDetailReport()
      }, err => {
        commit(types.INIT_MENU_LIST)
        if (err.response.data.code === 500157) {
          thisComponent.catchCategoryError()
        }
      })
    },
    [types.GET_TWO_DEPTH_MENU_INFO] ({ commit }, { projectId, twoDepthMenuId }) {
      return http.getPromise(`/menu/${projectId}/${twoDepthMenuId}`)
    }
  }
}
