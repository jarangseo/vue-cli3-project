<template>
<div class="fix-pivot-container" style="position: relative;border-right: 1px solid #ddd;" :ref="'pivot-container'" :style="{height: isNoData ? '340px' : fullHeight + 'px'}">
  <div class="fixedTable add_header_type no_data" id="" style="display:block;position: relative;overflow: hidden;" v-if="isNoData">
      <div class="inner_chart_area">
          <span class="ico_nodata"><span class="blind">데이터 없음</span></span>
          <p style="margin-bottom:0px" v-if="!isErrorFromPresto">
              {{dataBySelectedLang.analytics_object_msg_nodata}}
          </p>
          <p v-else>
            {{ prestoErrorMessage[_me['language'] || 'kr'] }}
          </p>
      </div>
  </div>
  <div class="fixedTable" style="position: relative;overflow: hidden;border-bottom: 1px solid #ddd;" v-if="loadComplete && !isNoData">
    <div class="fixedHeadBox" :style="{height: headerHeight + 'px'}">
      <div
        class="fixedHead"
        style="position: absolute; top: 0px; left: 0px;z-index: 4;overflow:hidden; border-right: 1px solid #ddd; border-top: 1px solid #ddd;"
      >
        <table class="table table-bordered table_sort table-fixed fake-head distTable" :ref="'headerTable'">
          <thead id="fakeHeaderHead" :ref="'fakeHeaderHead'">
            <tr v-for="(headerRow, idx) in headerData" :key="idx">
              <th
                v-for="(header, key) in headerRow"
                v-if="header ? header.isdraw : false"
                :key="key"
                class="dimension-th pivot-th"
                :class="{'dimension-td-fixed': header && header.isCommonHead, 'sorting': idx === headerData.length - 1}"
                :rowspan="header ? header.rowspan : 0"
                :colspan="header ? header.colspan : 0"
                :dataType="header ? header.type : ''"
              >
                <a v-if="(header && header.isCommonHead) || idx !== headerData.length - 2">
                  <div
                    class="th-div"
                    :class="{'no-visible': pivotData.headerInfo.colCombinationList.length === 0}"
                    :style="{width: header.width + 'px', height: cellHeight + 'px', cursor: 'pointer'}"
                    :data-x="key"
                    :data-y="idx"
                  >
                    <span
                      v-if="util.findGlossary(pivotData.glossaryList, header).length > 0"
                      v-tooltip="{ content: util.findGlossary(pivotData.glossaryList, header) }"
                    >
                    {{ header ? header.text : '' }}
                    </span>
                    <span
                      v-else
                    >
                    {{ header ? header.text : '' }}
                    </span>
                  </div>
                </a>
                <a
                  v-else
                  class="btn_sort"
                  :class="{
                    '_hovered': hoveredHeaderIdx === idx && hoveredHeaderKey === key,
                    '_asc': sortingIdx === header.text && sortType === 'asc' && sortingPos === key,
                    '_desc': sortingIdx === header.text && sortType === 'desc' && sortingPos === key
                  }"
                  @click="sort(header.text, sortType, key, 'top')"
                  @mouseover="hoverHeader(idx, key)"
                  @mouseleave="leaveHeader(idx, key)"
                >
                  <div
                    class="th-div"
                    :class="{'clicked-column': pivotData.headerInfo.rowList.length === 0 ? clickedX === key : clickedX + 1 === key}"
                    :style="{width: header.width + 'px', height: cellHeight + 'px', cursor: 'pointer'}"
                    :data-x="key"
                    :data-y="idx"
                  >
                    <span
                      v-if="util.findGlossary(pivotData.glossaryList, header).length > 0"
                      v-tooltip="{ content: util.findGlossary(pivotData.glossaryList, header) }"
                    >
                    {{ header ? header.text : '' }}
                    </span>
                    <span
                      v-else
                    >
                    {{ header ? header.text : '' }}
                    </span>
                  </div>
                </a>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <perfect-scrollbar  :id="'pivot-container-'+ 1" class="tableBox" @ps-scroll-y="scrollPivot($event)" @ps-scroll-x="horizontalScrollPivot($event)" :ref="'scrollingTable'" :style="{height: fullHeight - headerHeight + 'px'}" style="overflow: auto;">
      <table :id="'pivot-'+ 1" class="table table-bordered table_sort table-fixed distTable" cellspacing='0' style="border: 1px solid #ddd;" :style="{'marginTop': -1 * headerHeight + 'px'}" :ref="'scrollingPivotTable'" v-resize="resizeCallback">
        <thead :ref="'pivot-thead'">
          <tr v-for="(headerRow, idx) in headerData" :key="idx">
            <th
              v-for="(header, key) in headerRow"
              v-if="header ? header.isdraw : false"
              :key="key"
              class="dimension-th pivot-th"
              :class="{'dimension-td-fixed': header && header.isCommonHead, 'sorting': header && sortingIdx === header.text}"
              :rowspan="header ? header.rowspan : 0"
              :colspan="header ? header.colspan : 0"
              :dataType="header ? header.type : ''"
              :ref="header && header.isCommonHead ? 'pivotLeftTopHead' : 'dataHead'"
            >
              <a v-if="header && header.isCommonHead">
                <div
                  class="th-div"
                  :style="{width: header.width + 'px', height: cellHeight + 'px', cursor: 'pointer'}"
                  :ref="'leftHeaderItem'"
                  :data-x="key"
                  :data-y="idx"
                >
                  <span :ref="'itemText'">{{ header ? header.text : '' }}</span>
                </div>
              </a>
              <a
                v-else
                class="btn_sort"
                :class="{
                  '_hovered': hoveredHeaderIdx === idx && hoveredHeaderKey === key,
                  '_asc': sortingIdx === header.text && sortType === 'asc' && sortingPos === key,
                  '_desc': sortingIdx === header.text && sortType === 'desc' && sortingPos === key
                }"
                @click="sort(header.text, sortType, key, 'left')"
                @mouseover="hoverHeader(idx, key)"
                @mouseleave="leaveHeader(idx, key)"
              >
                <div
                  class="th-div"
                  :style="{width: header.width + 'px', height: cellHeight + 'px', cursor: 'pointer'}"
                  :ref="'leftHeaderItem'"
                  :data-x="key"
                  :data-y="idx"
                >
                  <span :ref="'itemText'">{{ header ? header.text : '' }}</span>
                </div>
              </a>
            </th>
          </tr>
        </thead>
        <tbody :ref="'pivot-tbody'">
          <tr v-for="(row, idx) in bodyRows" :key="idx" :ref="'tbody-rows'">
            <td
              class="kpi-td"
              v-if="item.isdraw"
              :class="{
                'dimension-td': item.type === 'header',
                'dimension-column': item.type === 'header',
                'm-over': hoveredX === key || hoveredY === idx,
                'm-over-current': hoveredX === key && hoveredY === idx,
                'selectedTd': clickedX === key && clickedY === idx
              }"
              v-for="(item, key) in row"
              :colspan="item.colspan"
              :rowspan="item.rowspan"
              :ref="item.type === 'header' ? 'dataHeader' : 'dataInfo'"
              :key="key"
            >
              <div
                :style="{height: cellHeight + 2 + 'px', width: '100%', textAlign: item.type === 'header' ? 'center' : 'right'}"
                style="cursor:pointer;"
                @mouseover="item.type === 'header' ? () => {} : hoverItem(key, idx)"
                @mouseout="item.type === 'header' ? () => {} : outHover(key, idx)"
                @click="item.type === 'header' ? () => {} : clickItem($event, key, idx)"
                v-on:blur="item.type === 'header' ? () => {} : clickItem($event, key, idx)"
              >
                <span>
                  <span :class="{'blue': item.colorUsed && item.text * 1 > 0, 'red': item.colorUsed && item.text * 1 < 0, 'arrow': item.changeMarkUsed, 'up': item.changeMarkUsed && item.text * 1 > 0, 'down': item.changeMarkUsed && item.text * 1 < 0}">
                    {{ makeShowingText(item) }}
                  </span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </perfect-scrollbar>
    <!-- <div :id="'pivot-container-'+ 1" class="tableBox"  @scroll="scrollPivot($event)" :ref="'scrollingTable'" :style="{height: fullHeight - headerHeight + 'px'}" style="overflow: auto;">

    </div> -->
    <div
      class="fixedLeftBox"
      style="position: absolute; left: 0px; top: -1px; overflow: hidden; z-index:3; border-right: 1px solid #ddd;border-top: 1px solid #ddd;"
      :style="{width: leftWidth + 'px', height: isHorizontalScroll ? fullHeight - 15 + 'px' : fullHeight + 'px'}"
    >
      <div class="flb-cont" style="position: absolute; left: 0; top: 0; right: 0;border-left: 1px solid #ddd;" :style="{marginTop: headerHeight + 1 + 'px', height: fullHeight - headerHeight + 'px'}">
        <table class="table table-bordered" :ref="'leftTable'" :style="{width: leftWidth + 'px'}">
          <colgroup>
            <col
              v-for="(col, key) in bodyRows[0]"
              v-if="col.type === 'header' && col.isdraw"
              :key="key"
              :span="col.colspan"
              :width="finalColumnWidths[key]"
            >
          </colgroup>
          <tbody>
            <tr v-for="(row, idx) in bodyRows" :key="idx">
              <td
                v-for="(item, key) in row"
                class="kpi-td"
                v-if="item.type === 'header' && item.isdraw"
                :class="{'dimension-td': item.type === 'header', 'dimension-column': item.type === 'header', 'clicked-column': clickedY === idx}"
                :rowspan="item.rowspan"
                :colspan="item.colspan"
                :key="key"
                :ref="'fakeBodyHead'"
                style="padding: 0;"
              >
                <div
                  :style="{
                    width: '100%',
                    textAlign: 'center'
                  }"
                >
                  {{item.text}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="headerLeft"
      style="position: absolute; overflow: hidden; left: 0px; top: -1px; z-index: 6;border-top: 1px solid #ddd;border-right: 1px solid #ddd;"
      :style="{width: leftWidth + 'px', height: headerHeight + 'px'}"
    >
      <table class="table table-bordered table_sort table-fixed" style="width: 100%;">
        <thead>
          <tr v-for="(headerRow, idx) in headerData" :key="idx">
            <th
              v-for="(header, key) in headerRow"
              v-if="header ? header.isdraw && header.isCommonHead : false"
              :key="key"
              class="dimension-th pivot-th"
              :class="{'dimension-td-fixed': header && header.isCommonHead, 'sorting': sortingIdx === header.text && sortingPos === key, 'bg_img_input': idx === 0 && key === 0 && headerData.length > 1}"
              :rowspan="header ? header.rowspan : 0"
              :colspan="header ? header.colspan : 0"
              :dataType="header ? header.type : ''"
              :ref="'fakeLeftTopHead'"
            >
              <a v-if="!header.text">
                <div
                  class="th-div"
                >
                  <span
                    v-if="util.findGlossary(pivotData.glossaryList, header).length > 0"
                    v-tooltip="{ content: util.findGlossary(pivotData.glossaryList, header) }"
                  >
                  {{ header ? header.text : '' }}
                  </span>
                  <span
                    v-else
                  >
                  {{ header ? header.text : '' }}
                  </span>
                </div>
              </a>
              <a
                v-else
                class="btn_sort"
                :class="{
                  '_hovered': hoveredHeaderIdx === idx && hoveredHeaderKey === key,
                  '_asc': sortingIdx === header.text && sortType === 'asc' && sortingPos === key,
                  '_desc': sortingIdx === header.text && sortType === 'desc' && sortingPos === key
                }"
                @click="sort(header.text, sortType, key, 'left')"
                @mouseover="hoverHeader(idx, key)"
                @mouseleave="leaveHeader(idx, key)"
              >
                <div
                  class="th-div"
                >
                  <span
                    v-if="util.findGlossary(pivotData.glossaryList, header).length > 0"
                    v-tooltip="{ content: util.findGlossary(pivotData.glossaryList, header) }"
                  >
                  {{ header ? header.text : '' }}
                  </span>
                  <span
                    v-else
                  >
                  {{ header ? header.text : '' }}
                  </span>
                </div>
              </a>
            </th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
  <div class="tooltip" v-if="isShowDetailTooltip">
      <ul>
        <li>
          <!-- [D] 노출위치 지정 필요 -->
          <div class="grid_cell_info" ref="grid_cell_info" :style="{bottom: tooltipCoors.bottom + 'px', right: tooltipCoors.right + 'px'}" style="display:block;z-index: 90;visibility:hidden;">
              <table class="inner_cell_info">
                  <tbody>
                      <tr v-for="(val, key) in tooltipInfos" :key="key + '_' + val" :class="{'divide': key === tooltipTopPos}">
                          <td>{{key}}</td>
                          <td>{{val}}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </li>
      </ul>
  </div>
</div>
</template>
<script>
import { util } from '@/shared/utils/util'
import { mapState } from 'vuex'
import _ from 'lodash'
import '@/assets/css/tooltip/vtooltip.css'
import resize from 'vue-resize-directive'
import moment from 'moment'

export default {
  name: 'NewPivotTable',
  directives: {
    resize
  },
  props: {
    pivotData: Object,
    setTotalCnt: Function,
    initPivotFlag: Boolean,
    isGoToTableTop: Boolean,
    setGoToTableTop: Function,
    isNoData: Boolean,
    isResetPopupContent: Boolean,
    scrollTop: Number,
    pivotIdx: Number,
    isErrorFromPresto: {
      type:Boolean,
      default: false
    },
    changePivotData: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    pivotData (d) {
      this.loadComplete = false
      if (!_.isEmpty(d)) {
        this.initData(d, true)
      }
    },
    initPivotFlag (d) {
      let originPivotData = _.find(this._pivotDataList, {'pivotIdx': this.pivotIdx}).pivotData

      this.sortingIdx = ''
      this.hoveredHeaderIdx = -1
      this.hoveredHeaderKey = ''
      this.noRowMerge = false
      this.noColMerge = false
      this.isSorting = false
      this.hideToolTip()

      this.changePivotData(originPivotData)
    },
    isGoToTableTop (d) {
      let $scrollingTable = this.$refs['scrollingTable'].$el
      $scrollingTable.scrollTop = 0
      $scrollingTable.scrollLeft = 0
      this.hideToolTip()
      this.setGoToTableTop()
    },
    isFullScreenOpened (isFullScreen) {
      this.setFullHeightSameWindowHeight(isFullScreen)
      this.resizeTable()
      this.$nextTick(() => {
        this.setFakeHeaders()
      })
    },
    _rightPanelType (type) {
      this.hideToolTip()
    },
    isResetPopupContent () {
      this.hideToolTip()
    },
    _isTransitionEnd () {
      this.resizeTable()
      this.$nextTick(() => {
        this.setFakeHeaders()
      })
    },
    _resizeWindow () {
      if (this.isFullScreenOpened) {
        this.setFullHeightSameWindowHeight(this.isFullScreenOpened)
      }
      this.resizeTable()
      this.$nextTick(() => {
        this.setFakeHeaders()
      })
    }
  },
  data () {
    return {
      PAGE_SIZE: 50,
      MAX_ROWS: 50,
      MAX_COLS: 50,
      currentColumnRange: [],
      currentRowRange: [],
      hoveredHeaderIdx: -1,
      hoveredHeaderKey: -1,
      headerData: [],
      finalColumnWidths: [],
      currentRenderCount: 0,
      rowNumberPerRender: 0,
      sortedArrayKeys: [],
      bodyRows: [],
      noRowMerge: false,
      noColMerge: false,
      loadComplete: false,
      isCursorHold: false,
      isVerticalScroll: false,
      isHorizontalScroll: false,
      isInvisible: false,
      DEFAULT_CELL_WIDTH: 90,
      DEFAULT_CELL_HEIGHT: 36,
      cellWidth: 93,
      cellHeight: 36,
      fullHeight: 750,
      isSorting: false,
      fullWidth: 0,
      tooltipTopPos: '',
      isLockYMoreLoad: false,
      isLockXMoreLoad: false,
      headerHeight: 0,
      leftHeaderCnt: 0,
      leftWidth: 0,
      hoveredX: -1,
      hoveredY: -1,
      clickedX: -1,
      clickedY: -1,
      sortingIdx: -1,
      sortingPos: -1,
      sortType: 'desc',
      selectedSortIdx: -1,
      selectedSortType: 'desc',
      tooltipInfos: {},
      backupBodyRows: [],
      scrollYPos: 0,
      scrollXPos: 0,
      tooltipCoors: {
        bottom: 0,
        right: 0
      },
      isShowDetailTooltip: false,
      isKpiAliasCompleted: false,
    }
  },
  computed: {
    ...mapState({
      _pivotDataList: state => state.report._pivotDataList,
      _pivotData: state => state.report._pivotData,
      _isCompletePivotLoad: state => state.report._isCompletePivotLoad,
      _rightPanelType: state => state.report._rightPanelType,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      isFullScreenOpened: state => state.common.isFullScreenOpened,
      _fullScreenPivotIdx: state => state.common._fullScreenPivotIdx,
      _isTransitionEnd: state => state.menu.isTransitionEnd,
      _isTransitionStart: state => state.menu.isTransitionStart,
      _resizeWindow: state => state.report._resizeWindow,
      _me: state => state.common._me,
      prestoErrorMessage: state => state.common.prestoErrorMessage
    }),
    util () {
      return util
    }
  },
  methods: {
    setFullHeightSameWindowHeight (isFullScreen) {
      let pivotHeaderHeight = 53
      let fullSizeHeight = isFullScreen ? document.getElementsByClassName('full-screen-pivot')[0].clientHeight : 803 // 15: 하단 스크롤 범위 확보
      // PivotTable의 크기 변화에 따른 init
      if (!_.isEmpty(this.pivotData) && this._fullScreenPivotIdx === this.pivotIdx) {
        this.fullHeight = fullSizeHeight - pivotHeaderHeight
      }
    },
    makeShowingText (item) {
      let text = item.text
      if (item.changeMarkUsed) {
        text = !isNaN(item.text * 1) ? util.numberWithCommas(Math.abs(item.text * 1)) : item.text
      }

       if (!isNaN(item.text)) {
        text = (item.text * 1).toFixed(item.decimalCount)
      }

      if (item.percentMarkUSed) {
        // text가 ,가 붙고나면 아래 * 1 연산이 안됨.. 그래서 item.text로 NaN여부 체크
        text = !isNaN(item.text * 1) ?  util.numberWithCommas((text * 100)) + '%' : text
      } else {
        text = util.numberWithCommas(text)
      }
      return text || '-'
    },
    leaveHeader () {
    },
    sort (idx, type, key, headerPos) {
      this.hideToolTip()
      let pos = headerPos

      if (pos === 'left') {
        if (this.pivotData.headerInfo.columnList.indexOf(idx) > -1) {
          pos = 'leftColumn'
        }
      }

      if (this.sortingIdx === idx) {
        this.sortType = this.sortType === 'desc' ? 'asc' : 'desc'
      } else {
        this.sortingIdx = idx
        this.sortType = 'desc'
      }

      this.sortingPos = key
      this.isSorting = true

      if (pos === 'left') {
        this.sortPivot(key, this.sortType, pos)
      } else if (pos === 'leftColumn') {
        this.sortColumn(idx, this.sortType)
      } else if (pos === 'top') {
        this.sortPivot(key - 1, this.sortType, pos)
      }
    },
    hoverHeader (idx, key) {
      this.hoveredHeaderIdx = idx
      this.hoveredHeaderKey = key
    },
    hoverItem (x, y) {
      if (!this.isCursorHold) {
        this.hoveredX = x
        this.hoveredY = y
      }
    },
    hideToolTip () {
      this.isShowDetailTooltip = false
      this.isCursorHold = false
      this.clickedX = -1
      this.clickedY = -1
      this.hoveredX = -1
      this.hoveredY = -1
      this.tooltipTopPos = ''
      this.tooltipCoors = {
        bottom: 0,
        right: 0
      }
    },
    clickItem ($event, x, y, type) {
      let currentCell = $event.target.offsetParent.getBoundingClientRect() // grap td
      if ($event.target.tagName.toLowerCase() === 'span') {
        // div안에 span을 클릭할 경우 $event.target.offsetParent가 table로 잡힘, 그것을 방지하기 위한 코드
        currentCell = $event.target.parentElement.offsetParent.getBoundingClientRect()
      }
      this.isShowDetailTooltip = true
      this.tooltipCoors = {
        bottom: 0,
        right: 0
      }
      if (x === this.clickedX && y === this.clickedY || type === 'outside') {
        this.clickedX = -1
        this.clickedY = -1

        this.hoveredX = -1
        this.hoveredY = -1
        this.hideToolTip()
      } else {
        this.clickedX = x
        this.clickedY = y

        this.hoveredX = x
        this.hoveredY = y
        this.tooltipCoors.bottom = window.innerHeight - currentCell.bottom + currentCell.height
        this.tooltipCoors.right = window.innerWidth - currentCell.right + currentCell.width
        this.isCursorHold = true
        this.makeToolTipInfo(y, x)
      }
    },
    outHover (x, y) {
      if (x === this.hoveredX && y === this.hoveredY && !this.isCursorHold) {
        this.hoveredX = -1
        this.hoveredY = -1
      }
    },
    makeToolTipInfo (row, col) {
      let {aliasColCombinationList, columnList, rowList} = this.pivotData.headerInfo
      let $scrollingTable = this.$refs['scrollingTable'].$el
      let rowLen = rowList.length === 0 ? 1 : rowList.length
      let dataList = this.bodyRows[row]
      let columnDatas = aliasColCombinationList.length > 0 ? aliasColCombinationList[col - rowLen].split('|') : []
      let tooltipInfo = {}
      _.map(columnDatas, (u, i) => {
        tooltipInfo[columnList[i]] = u
        if (i === columnDatas.length - 1) {
          this.tooltipTopPos = columnList[i]
        }
      })
      _.map(dataList, (o, i) => {
        if (i < rowList.length && o.type === 'header') {
          tooltipInfo[rowList[i]] = o.text
        }
      })
      this.tooltipInfos = tooltipInfo
      this.$nextTick(() => {
        let $gridCellInfoBox = this.$refs['grid_cell_info']
        $gridCellInfoBox.style.visibility = 'inherit'

        this.$forceUpdate()
      })
    },
    formatHeadData (pivotData, columnRange) {
      let headerData = pivotData.headerInfo
      let rowNum = headerData.columnList.length + 1
      let columnNum = headerData.rowList.length + 1
      let noRows = headerData.rowList.length === 0
      let matrix = []
      let leftColSpan = 0
      let leftRowSpan = 0
      let comb = 0
      let originComb = 0
      let temp = ''
      let originTemp = ''
      let idx = -1
      let m = -1
      let isSameText = false
      for (let i = 0; i < rowNum; i++) {
        matrix.push(new Array(columnNum))
      }

      leftColSpan = headerData.rowList.length
      leftRowSpan = headerData.columnList.length
      matrix[0][0] = {
        isdraw: true,
        rowspan: leftRowSpan,
        colspan: leftColSpan,
        type: 'dimension',
        text: '',
        sortable: false,
        isCommonHead: true
      }
      for (let i = 0; i < leftColSpan; i++) {
        matrix[leftRowSpan][i] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: headerData.rowList[i],
          sortable: this.checkDMSortable(headerData.rowList[i]),
          isCommonHead: true
        }
      }
      for (let i = 0; i < leftRowSpan; i++) {
        matrix[i][leftColSpan] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: headerData.columnList[i],
          sortable: this.checkDMSortable(headerData.columnList[i]),
          isCommonHead: true
        }
      }
      if (!noRows && headerData.colCombinationList.length > 0) {
        matrix[leftRowSpan][leftColSpan] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: '',
          sortable: false,
          isCommonHead: true
        }
      }
      comb = headerData.aliasColCombinationList
      originComb = headerData.colCombinationList
      // [OGPQA-1414] column이 없는 경우 headerData가 셋팅되지않도록 수정
      if (comb.length > 0) {
        for (let i = columnRange[0], max= columnRange[1]; i < max; i++) {
          temp = comb[i].split('|')
          originTemp = originComb[i].split('|')
          idx = leftColSpan + 1 + i
          m = 0
          isSameText = true
          for (let j = 0; j < temp.length; j++) {
            matrix[j][idx] = {
              isdraw: true,
              rowspan: 1,
              colspan: 1,
              type: 'kpi',
              text: temp[j],
              isKpiTooltip: j === headerData.columnList.indexOf('KPI'),
              originKpiText: originTemp[j],
              parent: temp[j - 1] ? temp[j - 1] : '',
              sortable: false,
              isCommonHead: false
            }
            if (j === temp.length - 1) {
              if (noRows) {
                matrix[j][idx]['rowspan'] = 1
              } else {
                matrix[j][idx]['rowspan'] = 2
              }
              matrix[j][idx]['sortable'] = true
            }
          }
        }
      }
      _.map(matrix, (row, idx) => {
        _.forEach(row, (item, key) => {
          if (row[key + 1] && item && item.text === row[key + 1].text && idx < matrix.length - 2) {
            m = key + 1
            while(m < row.length) {
              if (item.text === row[m].text && !this.noColMerge && item.parent === row[m].parent) {
                row[m].isdraw = false
                item.colspan += 1
              } else {
                break
              }
              m++
            }
          }
        })
      })
      this.leftHeaderCnt = headerData.rowList.length
      return matrix
    },
    calcTHead (pivotData, columnRange) {
      // [OGPQA-1414] column이 없는 경우 headerData가 셋팅되지않도록 수정
      this.headerData = this.formatHeadData(pivotData, columnRange)
    },
    getDataForRender (pivotData) {
      let data = []
      let start = this.currentRenderCount * this.rowNumberPerRender
      let key = 0
      for (let i = 0; i < this.rowNumberPerRender; i++) {
        key = this.sortedArrayKeys[start + i]
        if (pivotData.dataList[key]) {
          data.push(pivotData.dataList[key])
        } else {
          this.loadDataCompleted = true
          break
        }
      }
      this.currentRenderCount++
      return data
    },
    initDataKeys (pivotData) {
      let that = this;
      this.sortedArrayKeys = []
      if (pivotData && pivotData.dataList.length > 0) {
        pivotData.dataList.forEach(function(item, key) {
          that.sortedArrayKeys.push(key)
        })
        this.rowNumberPerRender = pivotData.dataList.length
      }
    },
    horizontalScrollPivot ($event) {
      let $scrollingTable = this.$refs['scrollingTable'].$el
      let $scrollingPivotTable = this.$refs['scrollingPivotTable']
      let $headerTable = this.$refs['headerTable']
      let $leftTable = this.$refs['leftTable']
      let MAX_SCROLL_X = $scrollingPivotTable.clientWidth
      let MAX_SCROLL_Y = $scrollingPivotTable.clientHeight
      let offset_X = $scrollingTable.clientWidth
      let offset_Y = $scrollingTable.clientHeight + this.headerHeight
      let verticalDirection = ''
      let horizontalDirection = ''

      this.hideToolTip()
      $headerTable.style.marginLeft = '-' + $scrollingTable.scrollLeft + 'px'
      if (($scrollingPivotTable.getBoundingClientRect()).left > this.scrollXPos) {
        horizontalDirection = 'left'
      } else {
        horizontalDirection = 'right'
      }
      this.scrollYPos = ($scrollingPivotTable.getBoundingClientRect()).top
      this.scrollXPos = ($scrollingPivotTable.getBoundingClientRect()).left
      if ((MAX_SCROLL_X - offset_X - 200 < $scrollingTable.scrollLeft) && horizontalDirection === 'right' && !this.isLockXMoreLoad) {
        // lazyload x
        this.isLockXMoreLoad = true
        this.loadMoreCols().then(() => {
          this.isLockXMoreLoad = false
        })
      }
    },
    scrollPivot ($event) {
      let $scrollingTable = this.$refs['scrollingTable'].$el
      let $scrollingPivotTable = this.$refs['scrollingPivotTable']
      let $headerTable = this.$refs['headerTable']
      let $leftTable = this.$refs['leftTable']
      let MAX_SCROLL_X = $scrollingPivotTable.clientWidth
      let MAX_SCROLL_Y = $scrollingPivotTable.clientHeight
      let offset_X = $scrollingTable.clientWidth
      let offset_Y = $scrollingTable.clientHeight + this.headerHeight
      let verticalDirection = ''
      let horizontalDirection = ''

      this.hideToolTip()

      $leftTable.style.marginTop = '-' + $scrollingTable.scrollTop + 'px'
      $headerTable.style.marginLeft = '-' + $scrollingTable.scrollLeft + 'px'
      if (($scrollingPivotTable.getBoundingClientRect()).top > this.scrollYPos) {
        verticalDirection = 'up'
      } else {
        verticalDirection = 'down'
      }
      if (($scrollingPivotTable.getBoundingClientRect()).left > this.scrollXPos) {
        horizontalDirection = 'left'
      } else {
        horizontalDirection = 'right'
      }
      this.scrollYPos = ($scrollingPivotTable.getBoundingClientRect()).top
      this.scrollXPos = ($scrollingPivotTable.getBoundingClientRect()).left
      if ((MAX_SCROLL_X - offset_X - 200 < $scrollingTable.scrollLeft) && horizontalDirection === 'right' && !this.isLockXMoreLoad) {
        // lazyload x
        this.isLockXMoreLoad = true
        this.loadMoreCols().then(() => {
          this.isLockXMoreLoad = false
        })
      }
      if ((MAX_SCROLL_Y - offset_Y - 200 < $scrollingTable.scrollTop) && verticalDirection === 'down' && !this.isLockYMoreLoad) {
        // lazyload y
        this.isLockYMoreLoad = true
        this.loadMoreRows().then(() => {
          this.isLockYMoreLoad = false
        })
      }
    },
    loadMoreRows () {
      return new Promise((resolve => {
        let maxRowRange = this.pivotData.dataList.length
        let moreSize = (this.pivotData.dataList.length - this.currentRowRange[1]) < this.PAGE_SIZE ? (maxRowRange - this.currentRowRange[1]) : this.PAGE_SIZE
        if (this.currentRowRange[1] < maxRowRange) {
          this.currentRowRange[1] = this.currentRowRange[1] + moreSize
          this.makePivotTable(this.pivotData)
        }
        this.$forceUpdate()
        resolve()
      }))
    },
    loadMoreCols () {
      return new Promise(resolve => {
        let maxColsRange = this.pivotData.headerInfo.colCombinationList.length
        let moreSize = (maxColsRange - this.currentColumnRange[1]) < this.PAGE_SIZE ? maxColsRange - this.currentColumnRange[1] : this.PAGE_SIZE
        if (this.currentColumnRange[1] < maxColsRange) {
          this.currentColumnRange[1] = this.currentColumnRange[1] + moreSize
          this.makePivotTable(this.pivotData)
        }
        this.$forceUpdate()
        resolve()
      })
    },
    makeTextDeco (headerData, bodyData, kpiIdx) {
      let kpiExpression = this.pivotData.headerInfo.headerExpressionList
      let kpiExps = []
      if (kpiIdx === 'column') {
        _.map(headerData, (row, rowIdx) => {
          _.map(row, (col, idx) => {
            let kpiColumn = this.pivotData.headerInfo.rowList.length === 0 ? idx : idx - 1
            if (col && col.text && col.text.length > 0 && col.type === 'kpi') {
              if (kpiExpression[col.originKpiText]) {
                kpiExps.push({
                  row: rowIdx,
                  col: kpiColumn,
                  textDeco: kpiExpression[col.originKpiText]
                })
              }
            }
          })
        })
        _.map(bodyData, (row, idx) => {
          _.forEach(row, (item, key) => {
            let decoItem = _.find(kpiExps, {'col' : key})
            if (decoItem) {
              bodyData[idx][key] = {...bodyData[idx][key], ...decoItem.textDeco}
            }
          })
        })
      } else {
        _.map(bodyData, (row, rowIdx) => {
          _.map(row, (col, idx) => {
            if (col && col.text && col.text.length > 0) {
              if (kpiExpression[col.text]) {
                kpiExps.push({
                  row: rowIdx,
                  textDeco: kpiExpression[col.text]
                })
              }
            }
          })
        })
        _.forEach(bodyData, (row, idx) => {
          _.forEach(row, (item, key) => {
            if (_.find(kpiExps, {'row' : idx})) {
              bodyData[idx][key] = {...bodyData[idx][key], ..._.find(kpiExps, {'row' : idx}).textDeco}
            }
          })
        })
      }
    },
    checkDMSortable (dm) {
      let result = true
      return result
    },
    sortColumn (idx, direction) {
      const pivotData = _.cloneDeep(this.pivotData)
      const columnList = pivotData.headerInfo.aliasColCombinationList
      const dataList = pivotData.dataList
      const rowHeaderCnt = pivotData.headerInfo.rowList.length
      const rowIdx = pivotData.headerInfo.columnList.indexOf(idx)
      const type = ((item) => {
        let expression = ''
        if (isNaN(parseInt(item))) {
          expression = 'STRING'
        } else if (moment(item, 'YYYYMMDD').isValid()) {
          expression = 'DATE'
        } else {
          expression = 'NUMBER'
        }
        return expression
      })(columnList[0].split('|')[rowIdx])
      const sortingFunc = ((expression, type) => {
        let func
        if (expression === 'NUMBER' && type === 'desc') {
          func = util.descNumberCompare
        } else if (expression === 'NUMBER' && type === 'asc') {
          func = util.ascNumberCompare
        } else if (expression === 'STRING' && type === 'desc') {
          func = util.descStringCompare
        } else if (expression === 'STRING' && type === 'asc') {
          func = util.ascStringCompare
        } else if (expression === 'DATE' && type === 'desc') {
          func = util.descDateCompare
        } else if (expression === 'DATE' && type === 'asc') {
          func = util.ascDateCompare
        }
        return func
      })(type, direction)
      let sortedColumns = []
      let sortedColCombinationList = []
      let sortedDataList = []
      // divde colCombinationList
      _.forEach(columnList, (column, index) => {
        let useColumn = column.split('|')[rowIdx]
        sortedColumns.push({
          text: useColumn,
          idx: index
        })
      })
      // sort column

      sortedColumns = sortedColumns.sort(sortingFunc)
      let sortedList = []
      _.forEach(sortedColumns, o => {
        sortedColCombinationList.push(columnList[o.idx])
      })
      _.forEach(dataList, data => {
        _.forEach(sortedColumns, column => {
          sortedList.push(data[column.idx + pivotData.headerInfo.rowList.length])
        })
        sortedDataList.push(sortedList)
        sortedList = []
      })

      sortedDataList = _.map(sortedDataList, (dataList, key) => {
        let rowListStart = 0
        let rowListEnd = pivotData.headerInfo.rowList.length
        let pivotDataList = _.cloneDeep(pivotData.dataList)
        let rowItems = pivotDataList[key].splice(rowListStart, rowListEnd)
        return [...rowItems, ...dataList]
      })
      // assign to pivotData
      pivotData.headerInfo.aliasColCombinationList = sortedColCombinationList
      pivotData.dataList = sortedDataList
      // rerender pivot table
      this.noColMerge = true
      this.changePivotData(pivotData)
    },
    getRowsText (columnNum) {
      let txt = ''
      _.forEach(this.bodyRows, row => {
        _.forEach(row, (item, key) => {
          if (key === columnNum && item.text !== '-') {
            txt = item.text
          }
        })
      })
      return txt
    },
    sortPivot (columnNum, direction, colPos) {
      let before = null
      let after = null
      let beforeNumber = 0
      let afterNumber = 0
      let that = this
      let sortingData = []
      let idx = columnNum
      let newBodyRows = []
      let pivotData = _.cloneDeep(this.pivotData)
      let dataList = pivotData.dataList
      let rowMergeInfo = pivotData.headerInfo.rowMergeList
      let type = ((item) => {
        let expression = ''
        if (isNaN(parseInt(item))) {
          expression = 'STRING'
        } else if (moment(item, 'YYYYMMDD').isValid()) {
          expression = 'DATE'
        } else {
          expression = 'NUMBER'
        }
        return expression
      })(this.getRowsText(columnNum))
      let sortingFunc = ((expression, type) => {
        let func
        if (expression === 'NUMBER' && type === 'desc') {
          func = util.descNumberCompare
        } else if (expression === 'NUMBER' && type === 'asc') {
          func = util.ascNumberCompare
        } else if (expression === 'STRING' && type === 'desc') {
          func = util.descStringCompare
        } else if (expression === 'STRING' && type === 'asc') {
          func = util.ascStringCompare
        } else if (expression === 'DATE' && type === 'desc') {
          func = util.descDateCompare
        } else if (expression === 'DATE' && type === 'asc') {
          func = util.ascDateCompare
        }
        return func
      })(type, direction)
      let rows = []
      _.forEach(dataList, (row, index) => {
        _.forEach(row, (item, key) => {
          if (key === idx) {
            sortingData.push({
              text: item || '',
              idx: index
            })
          }
        })
      })
      sortingData = sortingData.sort(sortingFunc)
      _.forEach(sortingData, e => {
        rows.push(dataList[e.idx])
      })
      if (colPos === 'top') {
        this.noRowMerge = true
      } else {
        this.noRowMerge = false
      }
      this.noColMerge = false
      pivotData.headerInfo.rowMergeList = rowMergeInfo
      pivotData.dataList = rows
      this.changePivotData(pivotData)
    },
    calcTBody (headData, bodyData, columnRange, rowRange, redraw = true, isSort) {
      let metrix = []
      let m = 0
      let totalCnt = 0
      let kpiPos = this.pivotData.headerInfo.columnList.indexOf('KPI') > -1 ? 'column' : 'row'
      let kpiExps = []
      let checkAllRowDatas = (rows) => {
        let isAllRowDatas = false
        let dataRows = rows[0].filter(o => {
          return o.type === 'data'
        })
        if (rows[0].length === dataRows.length) {
          isAllRowDatas = true
        }

        return isAllRowDatas
      }

      if (bodyData.length > 0) {
        let rowsNum = bodyData.length
        let columnsNum = headData.colCombinationList.length
        let rowHeaderNums = headData.rowList.length
        for (let i = rowRange[0]; i < rowRange[1]; i++) {
          let row = []
          let rowData = bodyData[i]
          for (let j = columnRange[0], max = rowHeaderNums === 0 ? columnRange[1] + 1 : columnRange[1] + rowHeaderNums; j < max; j++) {
            row.push({
              isdraw: true,
              rowspan: 1,
              colspan: rowHeaderNums - 1 === j ? 2 : 1,
              type: j < rowHeaderNums ? 'header' : 'data',
              isEndHeader: j === rowHeaderNums - 1,
              text: rowData[j],
              singleTitle: true,
              sortable: false
            })
          }
          metrix.push(row)
        }
      }
      _.map(metrix, (row, idx) => {
        _.forEach(row, (item, key) => {
          if (metrix[idx + 1] && item.text === metrix[idx + 1][key].text && item.type === 'header' && !item.isEndHeader) {
            m = idx + 1
            while(m < metrix.length) {
              let condition = key === 0 ?
                item.text === metrix[m][key].text :
                item.text === metrix[m][key].text && metrix[idx][key - 1] && metrix[idx][key - 1].text === metrix[m][key - 1].text

              if (condition) {
                if (!this.noRowMerge) {
                  metrix[m][key].isdraw = false
                  item.rowspan += 1
                } else {
                  item.rowspan = 1
                }
              } else {
                break
              }
              m++
            }
          }
          if (item.type === 'data') {
            if (item.text) {
              totalCnt++
            }
            item.text = item.text ? item.text : '-'
          }
        })
      })
      // row에 header가 하나도 없는경우 (모두 column으로 셋팅되어있는 경우) 체크해서 앞에 header 넣어주기 (fakeLeftBox 활성화에 필요)
      if (checkAllRowDatas(metrix) && metrix.length === 1) {
        let dummyHeader = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'header',
          isEndHeader: false,
          text: '',
          sortable: false
        }
        metrix[0][0] = dummyHeader
      }
      // kpiexp
      this.makeTextDeco(this.headerData, metrix, kpiPos)
      this.bodyRows = metrix
    },
    resizeCallback () {
      if (this.isSorting) {
        this.isSorting = false
      } else {
        this.setFakeHeaders()
      }
    },
    resizeOriginTable () {
      let $table = this.$refs['scrollingPivotTable']
      let $tableWrapper = this.$refs['scrollingTable'].$el
      let $horizontalScrollbar = $tableWrapper.children[1]
      let $verticalScrollbar = $tableWrapper.children[2]

      $horizontalScrollbar.style.zIndex = '48'

      if ($tableWrapper.offsetWidth > $table.offsetWidth) {
        $table.style.width = '100%'
      } else {
        $horizontalScrollbar.style.opacity = '0.6'
      }
      if ($table.offsetHeight < this.fullHeight) {
        this.fullHeight = $table.offsetHeight
      } else {
        $verticalScrollbar.style.opacity = '0.6'
      }
    },
    setFakeHeader () {
      let $table = this.$refs['scrollingPivotTable']
      let $headerTable = this.$refs['headerTable']
      let fakeHeaderHead = this.$refs['fakeHeaderHead']
      let pivotTHead = this.$refs['pivot-thead']
      let $pivotContainer = this.$refs['pivot-container']
      let headers = pivotTHead.childNodes
      _.forEach(pivotTHead.children, (tr, idx) => {
        _.forEach(tr.children, (th, key) => {
          let w = util.isIE() ? th.getBoundingClientRect().width - 1 : th.getBoundingClientRect().width
          let tdw = util.isIE() ? th.clientWidth - 1 : th.clientWidth
          fakeHeaderHead.children[idx].children[key].style.width = w + 'px'
          fakeHeaderHead.children[idx].children[key].children[0].style.width = tdw + 'px'
        })
      })
      // horizontalScroll: horizontal Scroll이 발생하는 경우 (pivotTHead가 pivot-container 이상이 되는경우)
      if ($pivotContainer.offsetWidth < pivotTHead.offsetWidth) {
        // this.isHorizontalScroll = true
        this.fullHeight = this.fullHeight + 10
      }

      $headerTable.style.width = pivotTHead.clientWidth + 'px'
      this.headerHeight = fakeHeaderHead.offsetHeight
    },
    setFakeLeftBox () {
      let $leftHeaders = this.$refs['dataHeader']
      let $tBody = this.$refs['pivot-tbody']
      let $bodyRows = this.$refs['tbody-rows']
      let $fakeBodyHeads = this.$refs['fakeBodyHead']
      let $pivotLeftTopHead = this.$refs['pivotLeftTopHead']
      let lastLeftHeaderIdx = -1
      let leftWidth = 0

      this.finalColumnWidths = []

      _.forEach(this.bodyRows[0], (o, k) => {
        if (o.type === 'header' && this.bodyRows[0][k + 1] && this.bodyRows[0][k + 1].type === 'data') {
          lastLeftHeaderIdx = k + 1
        }
      })

      _.forEach($bodyRows[0].children, (child, idx) => {
        if (idx === 0) {
          leftWidth += child.offsetWidth
          this.finalColumnWidths.push(child.offsetWidth - 1)
        } else if (idx > 0 && idx < lastLeftHeaderIdx) {
          leftWidth += child.offsetWidth
          this.finalColumnWidths.push(child.offsetWidth)
        }
      })
      _.forEach($leftHeaders, (leftHeader, key) => {
        $fakeBodyHeads[key].style.height = leftHeader.offsetHeight + 'px'
      })
      this.leftWidth = leftWidth + 1
    },
    setLeftHeaderWidth () {
      let $fakeLeftTopHead = this.$refs['fakeLeftTopHead']
      let $pivotLeftTopHead = this.$refs['pivotLeftTopHead']
      _.forEach($pivotLeftTopHead, (leftTopHead, idx) => {
        $fakeLeftTopHead[idx].style.width = leftTopHead.offsetWidth + 'px'
        $fakeLeftTopHead[idx].style.height = leftTopHead.offsetHeight + 'px'
      })
    },
    setPivotVisibility (val) {
      let $pivotContainer = this.$refs['pivot-container']
      $pivotContainer.style.visibility = val
    },
    setFakeHeaders () {
      this.setFakeHeader()
      this.setFakeLeftBox()
      this.setLeftHeaderWidth()
      // visibility inherit
      // $refs 사용할 때, dom binding 안되면 $refs에 잡히지 않아, 간격조정하는 로직이 사용자에게 제공됨. 해당 이슈 수정을 위해 visibility 로직 사용 함.
      this.setPivotVisibility('inherit')
    },
    resizeTable (isSortingTable) {
      if (this.$refs['scrollingPivotTable']) {
        this.resizeOriginTable()
        if (isSortingTable) {
          this.$nextTick(() => {
            this.setFakeHeaders()
          })
        }
      }
    },
    makePivotTable (pivotData, isSortingTable) {
      this.setFullHeightSameWindowHeight(this.isFullScreenOpened)
      this.initDataKeys(pivotData)
      this.calcTHead(pivotData, this.currentColumnRange)
      this.calcTBody(pivotData.headerInfo, pivotData.dataList, this.currentColumnRange, this.currentRowRange)
      this.$nextTick(() => {
        this.resizeTable(isSortingTable)
      })
    },
    initPivotTableInfo () {
      this.headerData = []
      this.bodyRows = []
      this.cellWidth = 93
      this.cellHeight = 36
      this.fullHeight = 750
      this.fullWidth = 0
      this.headerHeight = 0
      this.leftHeaderCnt = 0
      this.leftWidth = 0
    },
    initData (pivotData, isSortingTable) {
      const existKpiInRow = pivotData.headerInfo.existKpiInRow
      if (existKpiInRow && !this.isKpiAliasCompleted) {
        const kpiIndex = pivotData.headerInfo.rowList.indexOf('KPI')
        let copiedDataList = pivotData.dataList.map( d => {
          let newData = d
          newData[kpiIndex] = pivotData.headerInfo.headerExpressionList[d[kpiIndex]].alias
          return newData
        })
        pivotData.dataList = copiedDataList
        this.isKpiAliasCompleted = true
      }

      let columnLength = pivotData.headerInfo.colCombinationList.length > this.MAX_COLS ? 50 : pivotData.headerInfo.colCombinationList.length
      let rowLength = pivotData.dataList.length > this.MAX_ROWS ? 50 : pivotData.dataList.length

      this.setTotalCnt(pivotData.dataList.length)
      this.initPivotTableInfo()
      this.loadComplete = true
      this.currentColumnRange = [0, columnLength]
      this.currentRowRange = [0, rowLength]
      if (pivotData.dataList.length > 0 && !this.isNoData) {
        // [OGPQA-1414] column이 없는 경우 기본적인 currentColumnRange 셋팅
        if (this.currentColumnRange[1] === 0) {
          this.currentColumnRange[1] = pivotData.dataList[0].length - pivotData.headerInfo.rowList.length
        }
        this.makePivotTable(pivotData, isSortingTable)
      } else {
        // 데이터 없을 경우 visibility hidden에 대한 방어 코드
        this.setPivotVisibility('inherit')
      }
    }
  },
  mounted () {
    if (!_.isEmpty(this.pivotData)) {
      // visibility hidden
      // 첫 로딩시에만 적용되도록 위치 조정
      this.setPivotVisibility('hidden')
      this.initData(this.pivotData)
    }
  }
}
</script>
<style lang="scss" scoped>

@mixin bg_icon_font($content, $f_size){
    content: $content;
    font-size: $f_size;
    font-family: growthy-map-icons;
}
.no_data {
  border: 1px solid #ddd;
}
.fake-head {
  thead {
    th {
      border-left: 1px solid #ddd;
      border-right: 0 !important;
      div {
        &.no-visible {
          visibility: hidden;
        }
        span {
          padding: 0 25px;
        }
      }
    }
  }
}
.distTable {
  position: relative;
  border-collapse: collapse;
  thead {
    th {
      div.th-div {
        &.clicked-column {
          color: #00a000;
        }
        padding: 8px 0;
        margin: 0 auto;
        font-weight: 600;
        span {
          padding: 0 25px;
        }
      }
    }
  }
  tbody {
    td {
      &.dimension-td {
        left: 0;
        &.clicked-column {
          color: #00a000;
        }
        &.m-over {
          background: #fcfefb;
        }
        &.m-over-current {
          background: #f2faf1;
        }
        div {
          text-align: center;
          display:inline-block;
          padding: 8px 0;
          span {
            font-weight: 600;
            padding:0 25px;
          }
        }
      }
    }
  }
}
// .fixedHead {
//   border-top: 1px solid #ddd;
//   border-left: 1px solid #ddd;
//   .table {
//     th {

//     }
//   }
// }
.fixedLeftBox {
  table {
    tbody {
      tr {
        td {
          &.clicked-column {
            color: #00a000;
          }
          padding: 0;
          &.m-over {
            background: #fcfefb;
          }
          &.m-over-current {
            background: #f2faf1;
          }
          div {
            text-align: center;
            display:inline-block;
            padding: 8px 0;
            span {
              padding: 0 25px;
            }
          }
        }
      }
    }
  }
}
.headerLeft {
  thead {
    tr {
      th {
        ._hovered {
          &:before {
            top: -1px !important;
          }
          &:after {
            bottom: -1px !important;
          }
        }
        div {
          font-weight: 600;
          padding: 8px 0 !important;
          span {
            margin: 0 25px;
          }
        }
        &.bg_img_input{
            background-image: url("~@/assets/img/bg_table_none_area2.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            -webkit-background-size: 100% 100%;
            .align_right{
                float:right;
            }
        }
      }
    }
  }
  // border-right: 1px solid #ddd;
}
.tooltip {
  .grid_cell_info {
    position: fixed !important;
    z-index: 10;
    right: auto;
    bottom: auto;
    table {
      tbody {
        tr {
          &.divide {
            border-bottom: 1px solid #ddd;
            td {
              padding-bottom: 7px;
            }
          }
        }
      }
    }
  }
}
.kpi-td {
  .blue {
    color: #007dff;
  }
  .red {
    color: #d0021b;
  }
  .up {
    // color: #007dff;
    &.arrow{
        position: relative;
        &:before{
            position: absolute;
            top: -1px;
            left: -14px;
            @include bg_icon_font('\E006', 16px);
        }
    }
  }
  .down {
    // color: #d0021b;
    &.arrow{
        position: relative;
        &:before{
            position: absolute;
            top: -1px;
            left: -14px;
            @include bg_icon_font('\E005', 16px);
        }
    }
  }
}
.ps__rail-x,
.ps__rail-y {
  opacity: 0.6 !important;
}
</style>
