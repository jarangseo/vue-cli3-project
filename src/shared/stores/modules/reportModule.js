import {
  httpAnalytics
} from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'
import {
  util
} from '@/shared/utils/util'
import _ from 'lodash'
// import moment from 'moment'
// mock data
// import chartMock from '@/shared/utils/chartMock.js'
const http = httpAnalytics
export const reportModule = {
  state: {
    _currentDimension: 'overall',
    _initReportData: {
      dataHandlerType: {
        dateType: '',
        filterList: {}
      },
      byOverallObjectList: []
    },
    backupDefaultFilter: {},
    _chartData: {
      leftTitle: '',
      rightTitle: '',
      kpiExpression: {},
      secondKpiExpression: {},
      chartList: [],
      chartDataList: {
        dataList: [],
        xAxisList: []
      }
    },
    _halfChartData: {
      leftTitle: '',
      rightTitle: '',
      kpiExpression: {},
      secondKpiExpression: {},
      chartList: [],
      chartDataList: {
        dataList: [],
        xAxisList: []
      }
    },
    _pivotData: {
      dataList: [],
      headerInfo: {
        colCombinationList: [],
        columnList: [],
        existKpiInRow: false,
        headerExpressionList: {},
        kpiIndex: -1,
        rowList: []
      },
      type: 'pivot'
    },
    _pivotDataList: [],
    _isRightPanelOpen: false,
    _isCompleteChartLoad: false,
    _isCompletePivotLoad: false,
    _isCompleteTableLoad: true,
    _isCompeleteHafChart: false,
    _isUpdateGrid: false,
    _resizeWindow: false,
    _updateGridIdx: -1,
    _rightPanelType: 'pivot',
    _initPivotPanelInfo: {},
    _originPivotPanelInfo: {},
    _pivotDataHandlerType: {},
    _aboutReportInfo: {
      name: '',
      reportGlossary: {},
      mapLogList: [],
      kpiGlossaryList: [],
      dimensionGlossaryList: []
    },
    _aboutChartInfo: {
      name: '',
      chartGlossary: {},
      kpiGlossaryList: [],
      dimensionGlossaryList: []
    },
    _pivotObjForUpdate: {},
    _pivotObjectInfo: {},
    _objectId: 0,
    _isLeft: true,
    _depth: 0,
    _menuId: 0,
    _currentDates: [],
    _byOverallObjectList: [],
    _byDemensionObjectList: [],
    _glossaryList: [],
    _pivotInfoId: 0
  },
  mutations: {
    [types.SET_PIVOT_IDX] (state, idx) {
      state._updateGridIdx = idx
    },
    [types.TOGGLE_UPDATE_GRID] (state, {boolean, pivotObjForUpdate}) {
      state._isUpdateGrid = boolean
      state._pivotObjForUpdate = pivotObjForUpdate || {}
    },
    [types.SET_CURRENT_DATES] (state, { dateCode, startDate, endDate }) {
      state._currentDates = [startDate, endDate]
    },
    [types.INIT_REPORT_INFO] (state, _initReportData) {
      state._initReportData = _initReportData
      state._glossaryList = _initReportData.glossaryList
      state.backupDefaultFilter = _.cloneDeep(_initReportData.dataHandlerType)
    },
    [types.SET_HANDLER_FILTER_LIST] (state, filterList) {
      state._initReportData.dataHandlerType.filterList = filterList
    },
    [types.UPDATE_CHART_DATA_LIST] (state, _chartDataList) {
      state._chartData.chartDataList = _.cloneDeep(_chartDataList)
    },
    [types.UPDATE_CHART_DATA] (state, _chartData) {
      state._isCompleteChartLoad = true
      state._chartData = _chartData
    },
    [types.UPDATE_PIVOT_DATA] (state, {pivotData, pivotIdx}) {
      if (state._pivotDataList.length > 0) {
        let idx = _.findIndex(state._pivotDataList, {pivotIdx})
        if (idx > -1) {
          state._pivotDataList[idx] = {
            pivotData,
            pivotIdx
          }
        } else {
          state._pivotDataList.push({
            pivotData,
            pivotIdx
          })
        }
      } else {
        state._pivotDataList.push({
          pivotData,
          pivotIdx
        })
      }
    },
    [types.INIT_PIVOT_LIST] (state) {
      state._pivotDataList = []
    },
    [types.UPDATE_TABLE_DATA] (state, _tableData) {
      state._isCompleteTableLoad = true
      state._tableData = _tableData
    },
    [types.TOGGLE_RIGHT_PANEL] (state) {
      state._isRightPanelOpen = !state._isRightPanelOpen
      if (state._isRightPanelOpen === false) {
        state._rightPanelType = ''
      }
    },
    [types.CHECK_RIGHT_PANNEL] (state, type) {
      state._rightPanelType = type
    },
    [types.RIGHT_PANNEL_OBJECT_ID] (state, { objectId, isLeft }) {
      state._objectId = objectId
      state._isLeft = isLeft
    },
    [types.RIGHT_PANNEL_DEPTH] (state, { menuId, depth }) {
      state._menuId = menuId
      state._depth = depth
    },
    [types.INIT_PIVOT_PANEL_INFO] (state, _initPivotPanelInfo) {
      state._byOverallObjectList = _.filter(_initPivotPanelInfo.byOverallObjectList, {
        'type': 'OB05'
      })
      state._byDemensionObjectList = _.filter(_initPivotPanelInfo.byDemensionObjectList, {
        'type': 'OB05'
      })
      state._pivotDataHandlerType = _initPivotPanelInfo.dataHandlerType
    },
    [types.SELECT_PIVOT_PANEL_INFO] (state, id) {
      state._pivotInfoId = id
    },
    [types.GET_ABOUT_THIS_REPORT] (state, _aboutReportInfo) {
      state._aboutReportInfo = _aboutReportInfo
    },
    [types.GET_ABOUT_THIS_CHART] (state, _aboutChartInfo) {
      state._aboutChartInfo = _aboutChartInfo
    },
    [types.INIT_ABOUT_THIS_REPORT] (state) {
      state._aboutReportInfo = {
        name: '',
        reportGlossary: {},
        mapLogList: [],
        kpiGlossaryList: [],
        dimensionGlossaryList: []
      }
    },
    [types.INIT_ABOUT_THIS_CHART] (state) {
      state._aboutChartInfo = {
        name: '',
        chartGlossary: {},
        kpiGlossaryList: [],
        dimensionGlossaryList: []
      }
    },
    [types.RESIZE_WINDOW] (state) {
      state._resizeWindow = !state._resizeWindow
    },
    [types.CHANGE_DIMENSION] (state, dimension) {
      state._currentDimension = dimension
    }
  },
  actions: {
    [types.INIT_REPORT_INFO] ({
      commit
    }, {
      menuId,
      depth,
      projectId,
      reportId,
      thisComponent
    }) {
      commit(types.INIT_REPORT_INFO, {
        dataHandlerType: {
          dateType: '',
          filterList: {},
          defaultDate: {
            from: 0
          }
        },
        initCodeList: {
          dateList: []
        },
        byOverallObjectList: [],
        byDemensionObjectList: []
      })
      if (menuId) {
        http.getPromise(`/report/layout/${menuId}/${depth}/project/${projectId}`).then(res => {
          commit(types.INIT_REPORT_INFO, res.data)
          thisComponent.loadComplete()
          commit(types.INIT_PIVOT_PANEL_INFO, res.data)
        }, err => {
          if (err.response.data.code === 500921) {
            thisComponent.permissionError()
          } else if (err.response.data.code === 500158) {
            thisComponent.notDeployedError(err.response.data.message)
          } else {
            // [OGPQA-1066] toastr()제거 요청
            // util.toastr().error(err.response.data.message)
            thisComponent.errorLoadInitData()
          }
        })
      }
      // [OGPQA-1322] Call API only if reportId is not undefined
      if (reportId) {
        http.getPromise(`/report/related/${reportId}/project/${projectId}`).then(res => {
          commit(types.INIT_REPORT_INFO, res.data)
          thisComponent.loadComplete()
          commit(types.INIT_PIVOT_PANEL_INFO, res.data)
        }, err => {
          if (err.response.data.code === 500921) {
            thisComponent.permissionError()
          } else if (err.response.data.code === 500158) {
            thisComponent.notDeployedError(err.response.data.message)
          } else {
            util.toastr().error(err.response.data.message)
            thisComponent.errorLoadInitData()
          }
        })
      }
    },
    [types.INIT_PREVIEW_INFO] ({
      commit
    }, {
      projectId,
      reportId,
      thisComponent
    }) {
      commit(types.INIT_REPORT_INFO, {
        dataHandlerType: {
          dateType: '',
          filterList: {},
          defaultDate: {
            from: 0
          }
        },
        initCodeList: {
          dateList: []
        },
        byOverallObjectList: [],
        byDemensionObjectList: []
      })
      http.getPromise(`/report/preview/${reportId}/project/${projectId}`).then(res => {
        commit(types.INIT_REPORT_INFO, res.data)
        thisComponent.loadComplete()
        commit(types.INIT_PIVOT_PANEL_INFO, res.data)
      }, err => {
        if (err.response.data.code === 500921) {
          thisComponent.permissionError()
        } else if (err.response.data.code === 500158) {
          thisComponent.notDeployedError(err.response.data.message)
        } else {
          util.toastr().error(err.response.data.message)
          thisComponent.errorLoadInitData()
        }
      })
    },
    [types.INIT_PIVOT_PANEL_INFO] ({
      commit
    }, reqBody) {
      http.putPromise(`/report/preview/chart/data`, reqBody).then(res => {
        commit(types.INIT_PIVOT_PANEL_INFO, res.data)
      }).catch(err => {
        util.toastr().error(err.response.data.message)
      })
    },
    [types.UPDATE_OBJECT] ({
      commit
    }, objectList) {
      let objectTypes = [{
        object: 'OB01',
        types: types.UPDATE_CHART_DATA
      },
      {
        object: 'OB02',
        types: types.UPDATE_CHART_DATA
      },
      {
        object: 'OB03',
        types: types.UPDATE_CHART_DATA
      },
      {
        object: 'OB04',
        types: types.UPDATE_TABLE_DATA
      },
      {
        object: 'OB05',
        types: types.UPDATE_PIVOT_DATA
      }
      ]
      let typeList = []
      _.map(objectList, u => {
        let filter = objectTypes.filter(o => {
          return o.object === u.type
        })[0]
        typeList.push({
          type: filter.types,
          obj: u.obj
        })
      })
      Promise.all(_.map(typeList, o => {
        return this.dispatch(o.type, o.obj)
      })).then(res => {
        this.commit(types.UPDATE_CHART_DATA, res[0])
        this.commit(types.UPDATE_PIVOT_DATA, res[1])
      }).catch(() => {
        this.state.report_isCompleteChartLoad = true
      })
    },
    [types.UPDATE_CHART_DATA] ({
      commit
    }, {isPreview, reqBody}) {
      this.state._isCompleteChartLoad = false
      const url = isPreview ? `/report/preview/chart/data` : `/report/chart/data`
      return new Promise((resolve, reject) => {
        http.putPromise(url, reqBody).then(res => {
          resolve(res.data)
        }).catch((err) => {
          this.state.report._isCompleteChartLoad = true
          reject(err)
        })
      })
    },
    [types.UPDATE_PIVOT_DATA] ({
      commit
    }, {isPreview, reqBody}) {
      this.state.report._isCompletePivotLoad = false
      const url = isPreview ? `/report/preview/pivot/data` : `/report/pivot/data`
      return new Promise((resolve, reject) => {
        http.putPromise(url, reqBody).then(res => {
          resolve(res.data)
        }).catch(err => {
          // util.toastr().error(err.response.data.code)
          this.state.report._isCompletePivotLoad = true
          reject(err)
        })
      })
    },
    [types.UPDATE_TABLE_DATA] ({
      commit
    }, {isPreview, reqBody}) {
      this.state.report._isCompleteTableLoad = false
      const url = isPreview ? `/report/preview/table/data` : `/report/table/data`
      return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //   resolve(chartMock.tableGrid)
        // }, 1000)
        http.putPromise(url, reqBody).then(res => {
          resolve(res.data)
        }).catch((err) => {
          // util.toastr().error(err.response.data.code)
          this.state.report._isCompleteTableLoad = true
          reject(err)
        })
      })
    },
    [types.UPDATE_HALF_CHART_DATA] ({
      commit
    }, {isPreview, reqBody}) {
      this.state.report._isCompeleteHafChart = false
      const url = isPreview ? `/report/preview/chart/data` : `/report/chart/data`
      return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //   resolve(chartMock.halfChart)
        // }, 1000)
        http.putPromise(url, reqBody).then(res => {
          resolve(res.data)
        }).catch((err) => {
          // this.state.report._isCompeleteHafChart = true
          reject(err)
        })
      })
    },
    [types.UPDATE_DOUBLE_HALF_CHART_DATA] ({
      commit
    }, {isPreview, reqBody}) {
      let getChartData = (bodyObj) => {
        const url = isPreview ? `/report/preview/chart/data` : `/report/chart/data`
        return new Promise((resolve, reject) => {
          http.putPromise(url, bodyObj).then(res => {
            resolve(res.data)
          }).catch((err) => {
            reject(err)
          })
        })
      }
      this.state.report._isCompeleteHafChart = false
      return new Promise((resolve, reject) => {
        Promise.all([
          getChartData(reqBody[0]),
          getChartData(reqBody[1])
        ]).then(res => {
          let resObjList = []
          let resObjFormat = {
            chartDataList: [],
            chartList: [],
            gridData: null,
            kpiExpression: {},
            leftAxisName: '',
            leftChartName: '',
            relatedReportId: -1,
            rightAxisName: '',
            rightChartName: '',
            secondKpiExpression: {},
            secondChartDataList: {},
            secondLeftAxisName: '',
            secondRightAxisName: '',
            type: 'chart',
            xAxisList: []
          }
          _.map(res, (obj, idx) => {
            let resObj = _.cloneDeep(resObjFormat)
            resObj.chartList = obj.chartList
            resObj.gridData = obj.gridData
            resObj.chartDataList = obj.chartDataList
            resObj.kpiExpression = obj.kpiExpression
            resObj.leftAxisName = obj.leftAxisName
            resObj.rightAxisName = obj.rightAxisName
            resObj.xAxisList = obj.xAxisList
            resObj.chartName = obj.leftChartName
            resObjList.push(resObj)
          })
          resolve(resObjList)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    [types.GET_ABOUT_THIS_REPORT] ({
      commit
    }, {
      menuId,
      depth,
      projectId,
      thisComponent
    }) {
      http.getPromise(`/report/info/${menuId}/${depth}/project/${projectId}`).then(res => {
        commit(types.GET_ABOUT_THIS_REPORT, res.data)
      }).catch(err => {
        if (err.response.data.code === 500921) {
          thisComponent.permissionError()
        }
      })
    },
    [types.GET_ABOUT_THIS_CHART] ({
      commit
    }, {
      objectId,
      isLeft,
      projectId
    }) {
      http.getPromise(`/report/chart/info/${objectId}/project/${projectId}/${isLeft}`).then(res => {
        commit(types.GET_ABOUT_THIS_CHART, res.data)
      })
    },
    [types.DOWNLOAD_CSV] ({
      commit
    }, reqBody) {
      const rollbackCurrency = data => {
        let currencyRollback = JSON.stringify(data.settings.selectedKpi)
          .replace(/\(￦\)/g, '@currency:KRW')
          .replace(/\(￥\)/g, '@currency:JPY')
          .replace(/\(\$\)/g, '@currency:USD')
        return JSON.parse(currencyRollback)
      }
      if (reqBody.settings.selectedKpi) {
        reqBody.settings.selectedKpi = rollbackCurrency(reqBody)
      }

      let isReal = window.location.href.indexOf('analytics.growthy.game.line.me') > -1
      // http.getPromise(`/report/export/csv?param='${JSON.stringify(reqBody)}'`)
      if (isReal) {
        window.open(`https://growthy-agw.game.line.me/v1/report/export/csv?param=${encodeURI(JSON.stringify(reqBody))}`)
      } else {
        window.open(`http://growthy-agw-dev.game.line-alpha.me:8009/v1/report/export/csv?param=${encodeURI(JSON.stringify(reqBody))}`)
      }
    },
    [types.DOWNLOAD_EXCEL] ({
      commit
    }, reqBody) {
      const rollbackCurrency = data => {
        let currencyRollback = JSON.stringify(data.settings.selectedKpi)
          .replace(/\(￦\)/g, '@currency:KRW')
          .replace(/\(￥\)/g, '@currency:JPY')
          .replace(/\(\$\)/g, '@currency:USD')
        return JSON.parse(currencyRollback)
      }
      if (reqBody.settings.selectedKpi) {
        reqBody.settings.selectedKpi = rollbackCurrency(reqBody)
      }

      let isReal = window.location.href.indexOf('analytics.growthy.game.line.me') > -1
      if (isReal) {
        window.open(`https://growthy-agw.game.line.me/v1/report/export/excel?param=${encodeURI(JSON.stringify(reqBody))}`)
      } else {
        window.open(`http://growthy-agw-dev.game.line-alpha.me:8009/v1/report/export/excel?param=${encodeURI(JSON.stringify(reqBody))}`)
      }
    }
  }
}
