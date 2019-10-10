<template>
<!-- fixed_table -->
<div class="fixedTable" id="demo">
    <div class="fake-header" :style="{width: fakeHeaderWidth + 'px', height: fakeHeaderHeight + 'px'}">
        <table class="table table-bordered _fake" :refs="'titleHeader'">
            <tbody>
                <tr v-for="(column, idx) in columnList" :key="idx">
                    <td v-if="idx === 0" :colspan="rowList.length" :rowspan="columnList.length" class="bg_img_input"></td>
                    <td class="kpi">{{column}}</td>
                </tr>
                <tr>
                    <td class="category" v-for="(row, idx) in rowList" :key="idx">
                        <a class="btn_sort">{{row}}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <header class="fixedTable-header" :style="{marginLeft: fakeHeaderWidth + 'px', width: 'calc(100% - ' + fakeHeaderWidth + 'px)'}">
        <table class="table table-borderd _header" style="margin-left: 0px;" :style="{height: columnHeight + 'px'}" :refs="'gridHeader'">
            <colgroup>
                <col v-for="(colValue, idx) in columValueList[columValueList.length -1]" :key="idx" :width="eachRowWidth + ''">
            </colgroup>
            <tbody>
                <tr v-for="(colValue, idx) in columValueList" :key="idx">
                    <th
                    v-for="(column, key) in colValue"
                    :key="key"
                    :colspan="column.colspan"
                    :rowspan="column.rowspan"
                    :class="{'toggled': idx === columValueList.length -1 ? key === selectedColIdx : false}"
                    >
                    {{column.value}}
                    </th>
                </tr>
            </tbody>
        </table>
    </header>
    <aside class="fixedTable-sidebar" :style="{width: rowWidth + 'px'}">
        <table class="table table-bordered _aside" style="margin-top: 0px;" :refs="'gridAside'">
        <tbody>
            <tr v-for="(aside, key) in asideDataList" :key="key">
                <td 
                  class="category" 
                  v-for="(asideItem, idx) in aside" 
                  :key="idx" 
                  :colspan="2"
                  :dataFrom="key"
                  :class="{'selected': idx === aside.length -1 ? key === selectedRowIdx : false}"
                >
                {{asideItem}}
                </td>
            </tr>
        </tbody>
        </table>
    </aside>
    <div class="fixedTable-body" :style="{width: 'calc(100% - ' + fakeHeaderWidth + 'px)'}" @scroll="scrollBody" :refs="'dataBody'">
        <table class="table table-bordered _datas">
            <colgroup>
                <col v-for="(colValue, idx) in dataList[0]" :key="idx" :width="eachRowWidth + ''">
            </colgroup>
            <tbody>
                <tr v-for="(column, key) in dataList" :key="key">
                    <td 
                      v-for="(row, idx) in column" 
                      :key="idx" 
                      :class="{toggled: selectedRowIdx === key && selectedColIdx === idx, m_over: hoveredRowIdx === key && hoveredColIdx === idx}" 
                      @click="selectValue(idx, key)" 
                      @mouseover="hoveredRowIdx = key, hoveredColIdx = idx"
                      style="cursor: pointer;"
                    >
                        {{row || '-'}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- tooltip -->
    <!-- [D] tooltip의 경우, 스타일만 참고부탁드립니다. (별도 개발적용으로 위치지정이 필요) -->
    <div class="tooltip">
        <ul>
            <li>
                <!-- [D] 노출위치 지정 필요 -->
                <div class="tooltip_item" style="top:180px;left:20px;display:none;">
                    Console에서 Project 아이콘을 등록 할 수 있습니다.
                </div>
            </li>
            <li>
                <!-- [D] 노출위치 지정 필요 -->
                <div class="tooltip_item" style="top:430px;left:610px;display:none;">
                    The amount of change in action points<br>and its reason of change
                </div>
            </li>
            <li>
                <!-- [D] 노출위치 지정 필요 -->
                <div class="grid_cell_info" style="top:530px;left:610px;display:block;" v-if="isShowDetailTooltip">
                    <table class="inner_cell_info">
                        <tbody>
                            <tr v-for="(val, key) in tooltipInfos" :key="key + '_' + val">
                                <td>{{key}}</td>
                                <td>{{val}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </li>
        </ul>
    </div>
    <!-- //tooltip -->
</div>
<!-- //fixed_table -->
</template>
<script>
/* eslint no-unmodified-loop-condition: "off" */
// vue-pivot-table forked url : https://github.com/AlbertBae/vue-pivot-table.git
import naturalSort from 'javascript-natural-sort'
import _ from 'lodash'

export default {
  name: 'PivotData',
  props: {
    pivotData: Object,
    setTotalCnt: {
      type: Function,
      default: () => {}
    },
    isGoToTableTop: Boolean,
    setGoToTableTop: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    pivotData: {
      handler (d) {
        this.initData(d)
        this.$nextTick(() => {
          this.columnHeight = (this.columValueList.length + 1) * this.columnEachHeight
        })
      }
    },
    isGoToTableTop (isGo) {
      if (isGo) {
        this.goToTableTop()
      }
    },
    isShowDetailTooltip (isShow) {
      if (isShow) {
        setTimeout(() => { this.isShowDetailTooltip = false }, 1000)
      }
    }
  },
  data () {
    return {
      columValueList: [],
      columnMergedList: [],
      asideDataList: [],
      dataList: [],
      rowMergeList: [],
      columnList: [],
      rowList: [],
      columnHeight: 32,
      columnEachHeight: 32,
      rowWidth: 160,
      eachRowWidth: 160,
      fakeHeaderWidth: 0,
      fakeHeaderHeight: 0,
      selectedRowIdx: -1,
      selectedColIdx: -1,
      hoveredRowIdx: -1,
      hoveredColIdx: -1,
      tooltipInfos: {
      },
      isShowDetailTooltip: false
    }
  },
  computed: {
    naturalSort () {
      return naturalSort
    },
    _ () {
      return _
    }
  },
  methods: {
    selectValue (x, y) {
      if (this.selectedRowIdx === y && this.selectedColIdx === x) {
        this.selectedRowIdx = -1
        this.selectedColIdx = -1
      } else {
        this.selectedRowIdx = y
        this.selectedColIdx = x
      }
      this.makeToolTipInfo(y, x)
    },
    scrollBody () {
      let $body = this.$el.querySelector('.fixedTable-body')
      let $header = this.$el.querySelector('.fixedTable-header table')
      let $sidebar = this.$el.querySelector('.fixedTable-sidebar table')

      $sidebar.style['margin-top'] = -1 * $body.scrollTop + 'px'
      $header.style['margin-left'] = -1 * $body.scrollLeft + 'px'
    },
    goToTableTop () {
      let $body = this.$el.querySelector('.fixedTable-body')
      let $header = this.$el.querySelector('.fixedTable-header table')
      let $sidebar = this.$el.querySelector('.fixedTable-sidebar table')
      $body.scrollTop = 0
      $body.scrollLeft = 0

      $sidebar.style['margin-top'] = 0 + 'px'
      $header.style['margin-left'] = 0 + 'px'
      this.setGoToTableTop()
    },
    makeToolTipInfo (row, col) {
      let {colCombinationList, columnList, rowList} = this.pivotData.headerInfo
      let dataList = this.pivotData.dataList[row]
      let columDatas = colCombinationList[col].split(',')
      let tooltipInfo = {}
      _.map(columDatas, (u, i) => {
        tooltipInfo[columnList[i]] = u
      })
      _.map(dataList, (o, i) => {
        if (i < rowList.length) {
          tooltipInfo[rowList[i]] = o
        }
      })
      this.tooltipInfos = tooltipInfo
      this.$nextTick(() => {
        this.isShowDetailTooltip = true
      })
    },
    initData (data) {
      let headerInfo = data.headerInfo
      let columnCombinationList = []
      this.columnList = []
      this.rowList = []
      this.dataList = []
      this.asideDataList = []
      this.columnList = headerInfo.columnList
      this.rowList = headerInfo.rowList
      this.fakeHeaderWidth = this.eachRowWidth * (this.rowList.length + 1)
      this.fakeHeaderHeight = this.columnEachHeight * (this.columnList.length + 1)
      this.columnMergedList = headerInfo.columnMergeList
      columnCombinationList = headerInfo.colCombinationList
      this.rowMergeList = headerInfo.rowMergeList
      if (columnCombinationList.length > 0) {
        this.makeColumnValueList(columnCombinationList)
      } else {
        this.columnCombinationList = []
        this.columValueList = []
      }
      if (this.rowList.length > 0) {
        this.makeRowValueList()
      }
    },
    makeRowValueList () {
      let totalRecords = 0
      let maxRowCnt = this.rowList.length
      let datas = _.cloneDeep(this.pivotData.dataList)
      _.map(datas, u => {
        let dataList = u
        let asideDatas = dataList.splice(0, maxRowCnt)
        this.asideDataList.push(asideDatas)
        this.dataList.push(dataList)
      })
      _.map(this.dataList, u => {
        totalRecords += u.length
      })
      this.setTotalCnt(totalRecords)
      if (this.asideDataList.length > 0) {
        this.rowWidth = (this.eachRowWidth * this.asideDataList[0].length) + this.eachRowWidth
      } else {
        this.rowWidth = (this.eachRowWidth * this.rowList.length) + this.eachRowWidth
      }
    },
    makeColumnValueList (colCombinations) {
      let columnValues = []
      let totalLength = colCombinations[0].split(',').length
      for (let i = 0; i < totalLength; i++) {
        columnValues.push([])
      }
      _.map(colCombinations, o => {
        let columns = o.split(',')
        let existObj = {}
        let sameFieldChecker = (parent, value, depth) => {
          let sameFieldIdx = -1
          _.map(columnValues[depth], (item, idx) => {
            if (item.parent === parent && item.value === value) {
              sameFieldIdx = idx
            }
          })
          return sameFieldIdx
        }
        if (columns.length === 1) {
          columnValues[0].push({
            colspan: 1,
            value: columns[0],
            rowspan: 2
          })
        } else {
          _.map(columns, (u, i) => {
            if (i === 0 && columnValues[i].filter(o => { return o.value === u }).length === 0) {
              columnValues[i].push({
                value: u,
                colspan: this.columnMergedList[this.columnList[0]][u],
                rowspan: 1
              })
            }
            if (i > 0 && i < totalLength - 1 && sameFieldChecker(columns[i - 1], u, i) === -1) {
              columnValues[i].push({
                parent: columns[i - 1],
                value: u,
                colspan: 1,
                rowspan: 1
              })
            } else if (i > 0 && i < totalLength - 1 && sameFieldChecker(columns[i - 1], u, i) > -1) {
              existObj = columnValues[i].filter(val => {
                return val.parent === columns[i - 1] && val.value === u
              })[0]
              existObj.colspan += 1
            }
            if (i === totalLength - 1) {
              columnValues[i].push({
                colspan: 1,
                value: u,
                rowspan: 2
              })
            }
          })
        }
      })
      this.columValueList = columnValues
      // this.columnTotalWidth = this.columValueList[this.columValueList.length - 1].length * this.rowWidth
    }
  },
  mounted () {
    this.initData(this.pivotData)
    this.$nextTick(() => {
      this.columnHeight = (this.columValueList.length + 1) * this.columnEachHeight
    })
  }
}
</script>
<style lang="scss" scoped>
.header-wrapper {
  .fake-header {
    float: left;
    display: inline-block;
  }
  .fixedTable-header {
    display: inline-block;
  }
}
._header {
  tbody {
    tr {
      th.toggled {
        background-color: rgba(0, 160, 0, 0.1);
      }
    }
  }
}
._aside {
  tbody {
    tr {
      td.selected {
        background-color: rgba(0, 160, 0, 0.1);
      }
    }
  }
}
._datas {
  tbody {
    tr {
      td.toggled {
        border: 2px solid #000;
        z-index: 2;
      }
    }
  }
}
.row-name {
  border-left: 1px solid #e0e0e0;
}
.col-title {
  border-bottom: 1px solid #e0e0e0;
}
</style>
