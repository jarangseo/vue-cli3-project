<template>
	<div class="inner-con pivot-object">
		<div class="inner-top clearfix"> 
			<div class="inner-title"><span v-show="config.config.showTitle">{{config.name}}</span> <span class="small-text">{{pivotDataCount}} Records</span></div>
			<div class="handlebar">
				<ul class="table-handle" v-show="pivotDataCount !== '0' && !isLoading">
					<li class="sort">
						<a href="javascript:;" class="btn-nosort" @click="restoreDefaultSorting">
							<span class="icon-sorting icon-initiateSorting"></span><span class="table-handle-name">Initial Sorting</span>
						</a>
					</li>
					<li class="frameLock">
						<a href="javascript:;" class="btn-freeze" @click="frozenThead">
							<span class="icon-lock icon-frameLock"></span><span class="table-handle-name">Frame Lock</span>
						</a>
					</li>
					<li class="dropdown">
						<a id="table-download-type" href="javascript:;" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="icon-download"></span><span class="table-handle-name">Download</span> <span class="caret"></span></a>
						<ul class="dropdown-menu table-dropdown-menu" aria-labelledby="table-download-type">
							<li @click="exportTable('merge')"><a href="javascript:;"><span class="icon-excelFile"></span>Merged Excel File</a></li>
							<li @click="exportTable('split')"><a href="javascript:;"><span class="icon-excelFile"></span>Splite Excel File</a></li>
							<li @click="exportTable('csv')"><a href="javascript:;"><span class="icon-csvDownload"></span>CSV Download</a></li>
						</ul>
					</li>
					<li class="fullScreen">
						<a href="javascript:;" @click="controllDisplay"><span class="icon-fullScreen"></span>
							<template v-if="isFullScreen"><span class="table-handle-name">Normal Screen</span></template>
							<template v-else><span class="table-handle-name">Full Screen</span></template>
						</a>
					</li>
					<li class="toTop">
						<a href="javascript:;" class="btn-top disabled" @click="upToTop">
							<span class="icon-table-totop icon-top"></span><span class="table-handle-name">Top</span>
						</a>
					</li>
				</ul>
				<div class="plus-btn show-setting" v-if="isShowFilter && !isLoading" v-on:click='openSetting(config)'><span class="icon-handler"></span></div>
			</div>
		</div>
		<div class="inner-container inner-table-container" v-bind:class="{'noScroll':noScroll}">
			<div class='fix-pivot-container' style='position:relative;'>
				<div class="nodata hide" ><div class="nodata-text">No Data!</div></div>
				<div class="fixedTable">
					<div :id="'pivot-container-'+config.id" class="tableBox">
						<table :id="'pivot-'+config.id" class="table table-bordered distTable" cellspacing='0'>
							<thead></thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
				<div id='wordToolTip' class="tool-tip js-word-class-for-hide" style='display:none'>
					<em></em>
					<div class="innerHTML"></div>
				</div>
			</div>
			<div class="pivot-popup-info" style="display: none">
				<table class="pivot-popup-table">
					<tr v-for="item in popupInfo.rows">
						<th>{{item.title}}</th>
						<td>{{item.text}}</td>
					</tr>
					<tr>
						<td colspan="2"><hr></td>
					</tr>
					<tr v-for="item in popupInfo.cols">
						<th>{{item.title}}</th>
						<td>{{item.text}}</td>
					</tr>
				</table>
				<!-- <ul class="pivot-popup-list">
					<li v-for="item in popupInfo.rows">
						<div class="pivot-popup-title">{{item.title}}</div>
						<div class="pivot-popup-text">{{item.text}}</div>
					</li>
				</ul>
				<hr>
				<ul class="pivot-popup-list">
					<li v-for="item in popupInfo.cols">
						<div class="pivot-popup-title">{{item.title}}</div>
						<div class="pivot-popup-text">{{item.text}}</div>
					</li>
				</ul> -->
			</div>
		</div>
	</div>
</template>
<script>
import com from '@/shared/utils/commonModules.js';
export default {
  name: 'PivotTableOlder',
  data () {
    let isShowFilter=this.config.config.option!=='none'||this.config.config.hasDate;
    return {
      $$el: null,
      noScroll:false,
      isShowFilter,
      objectHeight: this.config.h * com.config.heightPXPerUnit,
      $pivot: null,
      $pivotContainer: null,
      $fixPivotContainer: null,
      pivotData: null,
      pivotDataCount: '0',
      loadDataCompleted: false,
      currentRenderCount: 0,
      sortedArrayKeys: [],
      isDMSorting: false,
      isLoading: false,
      popupInfo: {'rows':[], 'cols': []},
      rowNumberPerRender: com.config.rowNumberPerRender,
      preRecordsToMerge: com.config.preRecordsToMerge,
      isFullScreen: false,
      applyParams: '',
      $pivotPopupInfo: null,
    }
  },
  methods: {
    initDom() {
      this.$pivot = this.$$el.find('#pivot-'+this.config.id);
      this.$pivotContainer = this.$$el.find('#pivot-container-'+this.config.id);
      this.$fixPivotContainer = this.$$el.find('.fix-pivot-container');
      this.$pivotPopupInfo = this.$$el.find('.pivot-popup-info');
    },
    getFilterInfo(customOpts={}, fromDataHandler=false) {
      return com.methods.getFilterInfo(this, customOpts, fromDataHandler);
    },
    initFrozenIcon: function(dataLength=0) {
      let $freeze = this.$$el.find('.btn-freeze');
      let $span = $freeze.find(".table-handle-name");
      let $icon = $span.prev();
      if (dataLength > 0) {
        $freeze.addClass('active');
        $span.text("Frame Lock");
        $icon.removeClass('icon-frameUnlock').addClass('icon-frameLock')
      } else {
        $freeze.removeClass('active');
        $span.text("Frame Unlock");
        $icon.removeClass('icon-frameLock').addClass('icon-frameUnlock')
      }
    },
    initIconStatus: function(dataLength, type) {
      if (!this.isDMSorting) {
        this.$$el.find('.btn-nosort').addClass('disabled');
      }
      this.$$el.find('.btn-top').addClass('disabled');
      if (type && type === 'sorting') {

      } else {
        this.initFrozenIcon(dataLength);
      }
    },
    initCountInfo: function() {
      this.currentRenderCount = 0;
      this.loadDataCompleted = false;
    },
    initDataKeys: function() {
      let that = this;
      this.sortedArrayKeys = [];
      if (this.pivotData && this.pivotData.body && this.pivotData.body.data) {
        this.pivotData.body.data.forEach(function(item, key) {
          that.sortedArrayKeys.push(key);
        })
      }
    },
    checkDMSortable: function(dm) {
      let result = true
      return result
    },
    formatHeadData: function(headData) {
      let rowsNum = headData.colDimensions.length + 1;
      let columnsNum = headData.display.length + 1
      let noRows = headData.rowDimensions.length == 0 ? true : false;
      let matrix = [];
      for (let i = 0; i < rowsNum; i++) {
        matrix.push(new Array(columnsNum));
      }
      let leftColSpan = headData.rowDimensions.length
      let leftRowSpan = headData.colDimensions.length
      matrix[0][0] = {
        isdraw: true,
        rowspan: leftRowSpan,
        colspan: leftColSpan,
        type: 'dimension',
        text: '',
        sortable: false,
        isCommonHead: true,
      }
      for (let i = 0; i < leftColSpan; i++) {
        matrix[leftRowSpan][i] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: headData.rowDimensions[i],
          sortable: this.checkDMSortable(headData.rowDimensions[i]),
          isCommonHead: true,
        };
      }
      for (let i = 0; i < leftRowSpan; i++) {
        matrix[i][leftColSpan] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: headData.colDimensions[i],
          sortable: this.checkDMSortable(headData.colDimensions[i]),
          isCommonHead: true,
        };
      }
      if (!noRows) {
        matrix[leftRowSpan][leftColSpan] = {
          isdraw: true,
          rowspan: 1,
          colspan: 1,
          type: 'dimension',
          text: '',
          sortable: false,
          isCommonHead: true,
        };
      }
      let comb = headData.colDimensionCombinations;
      for (let i = 0; i < comb.length; i++) {
        let temp = comb[i].split(';');
        let idx = leftColSpan + 1 + i;
        let m = 0;
        let isSameText = true;
        for (let j = 0; j < temp.length; j++) {
          matrix[j][idx] = {
            isdraw: true,
            rowspan: 1,
            colspan: 1,
            type: 'kpi',
            text: temp[j],
            sortable: false,
            isCommonHead: false,
          };
          if (j == temp.length - 1) {
            if (noRows) {
              matrix[j][idx]['rowspan'] = 1;
            } else {
              matrix[j][idx]['rowspan'] = 2;
            }
            matrix[j][idx]['sortable'] = true;
          }
          if (matrix[j][idx - 1] && (matrix[j][idx - 1]['text'] == matrix[j][idx]['text'])) {
            m = j;
            while (m >= 0) {
              if (matrix[m][idx - 1]['text'] != matrix[m][idx]['text']) {
                isSameText = false;
                break;
              }
              m--;
            }
            if (isSameText) {
              matrix[j][idx - 1]['isdraw'] = false;
              matrix[j][idx]['colspan'] = matrix[j][idx - 1]['colspan'] + 1;
            }
          }
        }
      }
      return matrix;
    },
    renderTHead: function (headData) {
      let data = this.formatHeadData(headData);
      let $thead = this.$pivot.find('thead');
      $thead.html('');
      if (Array.isArray(data)) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
          html += '<tr>';
          for (let j = 0, columnsNum = data[i].length; j < columnsNum; j++) {
            if (data[i][j] && data[i][j]['isdraw'] == true) {
              html += '<th ';
              if (this.config.config.word && this.config.config.word[data[i][j]['text']]) {
                html += ` data-word="${data[i][j]['text']}" `
              }
              html += 'class=" dimension-th pivot-th';
              if (data[i][j]['isCommonHead'] == true) {
                html += ' dimension-td-fixed ';
              }
              if (i ===0 && j === 0) {
                html += ' diagonal-line ';
              }
              if (data[i][j]['sortable'] == true) {
                html += ' sorting';
              }
              html += ' " rowspan="' + data[i][j]['rowspan'] + '" colspan="' + data[i][j]['colspan'] + '" data-type="' + data[i][j]['type'] + '"><div class="th-div"><span>' + data[i][j]['text'] + '</span></div></th>';
            }
          }
          html += '</tr>';
        }
        $thead.append(html);
      } else {
        $thead.append(headData);
      }
    },
    renderTbody: function(headData, bodyData, redraw = true) {
      if (redraw) {
        this.$pivot.find('tbody').html('');
        this.upToTop();
      }
      if (bodyData.length > 0) {
        let $tbody = this.$pivot.find('tbody');
        let rowsNum = bodyData.length;
        let columnsNum = headData.display.length;
        let dimensionColumnsLength = headData.rowDimensions.length;
        let noColumns = headData.colDimensions.length == 0 ? true : false;
        let html = '';
        let kpiName = '';
        for (let i = 0; i < rowsNum; i++) {
          kpiName = bodyData[i][headData.kpiIndex];
          html += '<tr>';
          for (let j = 0; j < columnsNum; j++) {
            if (j < dimensionColumnsLength) {
              html += '<td class="dimension-td dimension-column"';
              if (j == dimensionColumnsLength - 1) {
                if (noColumns) {
                  html += ' colspan ="1" ';
                } else {
                  html += ' colspan ="2" ';
                }
              }
              if (this.config.config.word  && this.config.config.word[bodyData[i][j]]) {
                html +=  ` data-word="${(bodyData[i][j] || '')}" `;
              }
              html += ' rowspan="1" >' + bodyData[i][j] + '</td>';
            } else {
              if (bodyData[i][j] === "") {
                html += '<td class="dimension-td dimension-column"></td>';
              } else {
                if (headData.kpiInRow) {
                  html += '<td class="kpi-td">' + com.methods.dataDisplayFormatter(headData.formatConfigMap[kpiName], bodyData[i][j]) + '</td>';
                } else {
                  html += '<td class="kpi-td">' + com.methods.dataDisplayFormatter(headData.display[j], bodyData[i][j]) + '</td>';
                }
              }
            }
          }
          html += '</tr>';
        }
        $tbody.append(html);
      }
    },
    tableMergeColumns: function($pivot, columnsNum, startRowIdx = 0) {
      let that = this;
      let $start = null;
      let $current = null;
      let mergeNum = 0;
      let children = '';
      let $this = null;
      for (let i = 0; i < columnsNum; i++) {
        children = " tr td:nth-child(" + (i + 1) + ")";
        if (startRowIdx > 0) {
          children += ":gt(" + startRowIdx + ")";
        }
        let $columns = $pivot.find(children);
        $columns.each(function(idx) {
          $this = $(this);
          if (idx == 0 && startRowIdx == 0) {
            $start = $this;
            mergeNum = 1;
          } else if (idx < that.preRecordsToMerge && startRowIdx > 0) {
            if ($this.data('lastMergedTd')) {
              $start = $this.data('lastMergedTd');
              mergeNum = Number($start.attr("rowSpan"));
            }
          } else {
            $current = $this;
            let isSameText = true;
            if ($start.text() != $current.text()) {
              isSameText = false;
            } else {
              let j = i;
              let $startPrev = $start.prev();
              let $currentPrve = $current.prev();
              while (j > 0) {
                if ($startPrev.text() != $currentPrve.text()) {
                  isSameText = false;
                  break;
                }
                $startPrev = $startPrev.prev();
                $currentPrve = $currentPrve.prev();
                j--;
              }
            }
            if (isSameText) {
              mergeNum++;
              $current.hide();
            } else {
              $start.attr("rowSpan", mergeNum);
              $start = $current;
              $current.data('lastMergedTd', $start);
              mergeNum = 1;
            }
          }

        });
        if (mergeNum > 1) {
          $start.attr("rowSpan", mergeNum);
          $current.data('lastMergedTd', $start);
        }
      }
    },
    initPivot: function(data, type) {
      let $element=this.$$el.find('.btn-freeze');
      let $span=$element.find(".table-handle-name")
      let $lockIcon = $span.prev();
      this.pivotData = data;
      this.initCountInfo();
      this.initDataKeys();
      this.$$el.find('.icon-sorting').data('sorted', false);
      if (data.body && data.body.data && data.body.data.length > 0) {
        this.$pivot.closest('.fixedTable').show();
        this.isDMSorting = (type === 'sorting') ? true : false;
        this.pivotDataCount = com.methods.thousandsSeparator(data.body.data.length);
        this.renderTHead(data.head);
        this.renderTbody(data.head, this.getDataForRender(), true);
        let mergeNum = data.head.rowDimensions.length;
        this.$pivotContainer.css({
          height:"auto"
        })
        let nHeight=this.$fixPivotContainer.height();
        this.tableMergeColumns(this.$pivot, mergeNum);
        if(this.isFullScreen){
          this.objectHeight = $(window).height() - this.$$el.find('.inner-top').outerHeight(true);
        }else{
          this.objectHeight=Math.min(this.config.h * com.config.heightPXPerUnit,nHeight)
        }
        /*if($lockIcon.hasClass('icon-frameUnlock')){
          this.$pivotContainer.css({
            height:this.objectHeight
          })
        };*/
        if(this.objectHeight>=nHeight){
          this.noScroll=true;
        }else{
          this.noScroll=false;
        };
        if (type === 'init' || type === 'dataHandlerApply') {
          let height = this.objectHeight;
          if (this.isFullScreen) {
            height = $(window).height() - this.$$el.find('.inner-top').outerHeight(true);
          }
          this.$$el.find('.fixedTable').fixedTable({
            height: height
          });
        } else if (type === 'sorting') {
          this.$$el.find('.fixedTable').fixedTable('reset');
        }
        this.$$el.find('.tableBox').scrollTop(0);
      } else {
        this.pivotDataCount = '0';
        this.$$el.find('.nodata').removeClass('hide');
        this.$pivot.closest('.fixedTable').hide();
        let $fixedTable = this.$$el.find('.fixedTable');
        if ($fixedTable.length > 0){
          $fixedTable.fixedTable('reset');
        }
      }
    },
    getPivotData(type, customOpts={}, callback) {
      let that = this;
      that.$$el.find('.nodata').addClass('hide');
      that.isLoading = true;
      that.noScroll=false;
      that.$pivotPopupInfo.css({
        display: 'none',
      })

      let params = {};
      if (type === 'init' || type === 'dataHandlerApply') {
        if (type === 'init') {
          params = that.getFilterInfo(customOpts);
        } else if (type === 'dataHandlerApply') {
          params = that.getFilterInfo(customOpts, true);
        }
        that.applyParams = JSON.stringify(params);
      } else if (type === 'sorting') {
        params = that.applyParams ? Object.assign(JSON.parse(that.applyParams), customOpts) : that.getFilterInfo(customOpts);
      }
      let tempParams = com.methods.addShortcutParams(JSON.parse(JSON.stringify(params)));
      com.util.promise({
        type:"POST",
        url: "/bip/report/data/" + tempParams.menuId,
        params:tempParams,
      }).then(data=>{
        // $(document.body).trigger('click.hideDialog');
        if (data.head.rowDimensions.length > 0 && data.head.colDimensionCombinations.length > 0) {
          that.$fixPivotContainer.removeClass('js-no-cross-line');
        } else {
          that.$fixPivotContainer.addClass('js-no-cross-line');
        }
        setTimeout(() => {
          that.initIconStatus(data.body.data.length, type);
        })
        that.initPivot(data, type);
        callback && callback(data);
        setTimeout(function(){
          that.isLoading = false;
        })
      }).catch( ()=>{
        that.isLoading = false;
      })
    }
  },
  mounted () {
    let that = this;
    that.$$el = $(this.$el);
    that.initDom();
    that.getPivotData('init');
    that.bindDomEvent();
  },
}
</script>
