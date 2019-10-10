<template>
  <div class="chart_middle_info custom_margin_top_zero" :class="isDirectionHorizon? 'basic_info_chart_horizon':''">
    <common-loading
      :is-show-loading="!isLoading" 
      :style="`min-width: ${loadingArea.width} !important; min-height: ${loadingArea.height} !important;`"
      :indicator-size="'small'"/>
    <!--:style="`${direction === 'horizon' && cardData.name === '' ? 'color: #ffffff' : ''}`"-->
        <p class="chart_info_name">
      <span
        v-tooltip.auto="tooltip.tooltip !== undefined ? {content: tooltip.tooltip, container: '.content'} : ''"
        v-html="getChartName !== '' ? getChartName : getChartNameNoData">
      </span>
      <!-- <template slot="popover">
        <div>
          <p style="fontWeight:bolder;">
            {{ tooltip.tooltip !== undefined ? tooltip.tooltip : '' }}
          </p>
        </div>
      </template> -->
    </p>
    <div v-if="!isDataEmpty" class="chart_info_data">
      <v-popover offset="0" trigger="hover" placement="bottom" :container="'.content'">
        <strong
          :class="`data_value get_data_value_offset_${getChartName}_${Number(cardData.value)}`"
          style="cursor:pointer !important;"
          :style="`${getChartValue === 0 && getChartName === '' ? 'color: #ffffff' : ''}`">
          <span class="sign_txt">{{ getSignTxt }}</span>{{ getChartValue }}<span class="unit_txt">{{ getUnitTxt }}</span>
        </strong>
        <template slot="popover" class="custom_tooltip">
          <div>
            <p style="fontWeight:bolder;">
              {{ mixinChangeDateForm(_currentDates.selectedDates) }}
              <!-- {{ _currentDates.selectedDates[0].replace(/-/gi, '') }} -->
            </p>
            <p style="padding-top: 3px;">{{ getSignTxt }}{{ getTooltipValue }}{{ getTooltipUnitTxt }} </p>
          </div>
        </template>
      </v-popover>
    </div>
    <div v-if="!isDataEmpty && hasTrend" class="chart_info_variation">
      <ul>
        <!-- [D] 상승 : increase, 감소 : decrease, 유지 : maintain 클래스 추가해주세요 -->
        <template v-for=" (item, index) in cardData.trendData">
          <li :class="`${ item.status }`" :style="`cursor:pointer !important;${direction === 'vertical' ? `margin-left:${item.value ? customMarginLeft + 'px' : '0px'};text-align: ${item.value ? 'left': ''};` : ''}`" :key="`basic-${index}`">
            <v-popover offset="0" trigger="hover" placement="bottom" :container="'.content'">
              <span class="cycle_info">
                <span class="blind">{{ item.type }}</span>{{ item.code }}
              </span>
              <span class="variation_mark"><span class="blind">{{ item.status }}</span></span>
              <span class="variation_data" :style="`${getFontSize}`">{{ Math.abs(item.value) }}%</span>
              <template slot="popover" class="custom_tooltip">
                <div>
                  <p style="fontWeight:bolder;">
                    {{ item.days ? mixinChangeDateForm(item.days) : '' }}
                  </p>
                  <p style="padding-top: 3px;">
                    {{ getSignTxt }}{{ item.days !== '' ? getStatusTooltipValue(item.over) : 'Network Error' }}{{ getTooltipUnitTxt }}
                  </p>
                </div>
              </template>
            </v-popover>
          </li>
        </template>
      </ul>
    </div>
    <div v-if="!!data.innerChartData"
      class="inner_chart_area get_height_innerChart_area">
      <basic-highchart
        v-if="!innerChartIsLoading"
        :height="innerChart.height"
        :options="options"/>
    </div>
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import BasicHighchart from './BasicHighchart'
  import CommonLoading from '../common/CommonLoading'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  import { util } from '@/shared/utils/util'
  import moment from 'moment'
  export default {
    name: 'BasicInfoChart',
    mixins: [ dashboardMixin ],
    props: {
      name: {
        type: String,
        required: false,
        default: ''
      },
      objId: {
        type: String,
        required: false,
        default: ''
      },
      chartType: {
        type: String,
        required: false,
        default: ''
      },
      data: {
        type: Object,
        required: false,
        default: () => {
          return {}
        }
      },
      direction: {
        type: String,
        required: false,
        default: 'vertical'
      },
      hasTrend: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    components: {
      BasicHighchart,
      CommonLoading
    },
    watch: {
      async data (item) {
        if (!_.isEmpty(item)) {
          this.cardData = item
          this.options.series = item.innerChartData
          if (item.innerChartData) this.options.xAxis.categories = item.innerChartData[0].xAxisList
          const tmp = await document.getElementsByClassName(`get_data_value_offset_${this.getChartName}_${Number(this.data.value)}`)
          _.toString(this.getChartValue).length > 2
          ? this.customMarginLeft = (await tmp[0].offsetLeft) * 0.7 - 10
          : this.customMarginLeft = (await tmp[0].offsetLeft) * (this.hasRevenue ? 0.6 : 0.8 )- 10
        } else {
          this.cardData = this.noData
          // const tmp = await document.getElementsByClassName(`get_data_value_offset_${this.getChartName}_${Number(this.data.value)}`)
        }

        if (_.has(item, 'innerChartData')
        && moment(this._currentDates.selectedDates, 'YYYY-MM-DD').format('YYYYMMDD') !== moment(item.innerChartData[0].xAxisList[item.innerChartData[0].xAxisList.length - 1], 'YYYYMMDD').format('YYYYMMDD')) {
          this.cardData.name = ''
          this.cardData.pservice = ''
          this.cardData.value = ''
          this.cardData.trendData = this.noData.trendData
        }
      },
      async _isOpenMenu (isOpen) {
         setTimeout(async () => {
          const tmp = await document.getElementsByClassName(`get_data_value_offset_${this.getChartName}_${Number(this.data.value)}`)
          _.toString(this.getChartValue).length > 2
          ? this.customMarginLeft = (await tmp[0].offsetLeft) * 0.7 - 10
          : this.customMarginLeft = (await tmp[0].offsetLeft) * (this.hasRevenue ? 0.6 : 0.8 )- 10
        }, this.navMenuTransitionDuration)
      },
      isLoading (loadingValue) {
        if (!loadingValue && _.isEmpty(this.data)) this.cardData = this.noData
      }
    },
    data () {return {
      isLoading: true,
      tooltip: {
        description: '',
        id: 0,
        name: '',
        tooltip: ''
      },
      cardData: {},
      tooltipBase: {
        dau: { name: 'DAU', glossaryId: 63 },
        mau: { name: 'MAU', glossaryId: 107 },
        nru: { name: 'NRU', glossaryId: this.isDaily ? 44 : 92 },
        dlcnt: { name: 'First Open Count', glossaryId: 18 },
        sale: { name: 'Revenue', glossaryId: 31 },
        pu: { name: 'PU', glossaryId: 29 },
        mtdau: { name: 'MTD Access User', glossaryId: 65 },
        mtdnru: { name: 'MTD NRU', glossaryId: 66 },
        mtdsale: { name: 'MTD Revenue', glossaryId: 79 },
        totau: { name: 'Total User', glossaryId: 20 },
        totsale: { name: 'Total Revenue', glossaryId: 32 },
        totdlcnt: { name: 'Total First Open Count', glossaryId: 194 },
        stu: { name: 'STU', glossaryId: this.isDaily ? 46 : 94 },
        cbu: { name: 'CBU', glossaryId: this.isDaily ? 45 : 93 },
        conncnt: { name: 'Total Access Count', glossaryId: 25 },
        conntm: { name: 'Total Access Time', glossaryId: 26 },
        arpau: { name: 'ARPAU', glossaryId: 37 },
        arppu: { name: 'ARPPU', glossaryId: 36 },
        pur: { name: 'PUR', glossaryId: 35 },
        npupur: { name: 'NPU PUR', glossaryId: 81 },
        rpupur: { name: 'RPU PUR', glossaryId: 82 },
        npuarppu: { name: 'NPU ARPPU', glossaryId: 192 },
        rpuarppu: { name: 'RPU ARPPU', glossaryId: 193 },

        'HAU': { name: 'HAU', glossaryId: 112 },
        'Min HAU': { name: 'Min HAU', glossaryId: 111 },
        'Max HAU': { name: 'Max HAU', glossaryId: 110 },
        'DTH Revenue': { name: 'DTH Revenue', glossaryId: 118 },
        'DTH PU': { name: 'DTH PU', glossaryId: 117 },
        'DTH Pay Count': { name: 'DTH Pay Count', glossaryId: 119 },
        'DTH AU': { name: 'DTH AU', glossaryId: 113 },
        'DTH First Open Count': { name: 'DTH First Open Count', glossaryId: 196 },
        'DTH NRU': { name: 'DTH NRU', glossaryId: 114 },
        'DTH Access Count': { name: 'DTH Access Count', glossaryId: 115 },
        'DTH Access Time': { name: 'DTH Access Time', glossaryId: 116 },
        'DTH PV': { name: 'DTH PV', glossaryId: 202 },
      },
      noData: {
        name: '',
        pservice: '',
        signTxt: '',
        trendData: [{
          code: 'D',
          days: '',
          status: 'maintain',
          type: 'daily',
          value: ''
        },{
          code: 'M',
          days: '',
          status: 'maintain',
          type: 'monthly',
          value: ''
        }],
        unitTxt: '',
        value: ''
      },
      options: {
        chart: { type: this.chartType, height: '50px', marginTop: 0 },
        title: { text: '' },
        subtitle: { text: '' },
        xAxis: { visible: false },
        yAxis: { visible: false },
        credits: { enabled: false },
        legend: '',
        tooltip: {
          formatter: function () {
            const name = _.upperCase(this.points[0].point.series.name.replace('_v', ''))
            const currency = ['ARPAU', 'ARPPU', 'NPUARPPU', 'RPUARPPU'].includes(name) ? this.points[0].series.userOptions.currency : ''
            const percent = ['PUR', 'NPUPUR', 'RPUPUR'].includes(name) ? '%' : ''
            return `${this.x}: ${currency}${this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${percent}`
          },
          shared: true
        },
        series: !_.isEmpty(this.data.innerChartData) ? this.data.innerChartData : []
      },
      innerChart: {
        width: '240px',
        height: '50px'
      },
      loadingArea: {
        width: '100%',
        height: '97px',
        config: {
          horizon: {
            height: '56px'
          },
          direction: {
            vertical: 'vertical',
            horizon: 'horizon'
          }
        }
      },
      customMarginLeft: '',
      innerChartIsLoading: true
    }},
    computed: {
      ...mapState({
        // _glossaryBase: state => state.dashboard.glossaryBase.numberType
        isDaily: state => state.dashboard.isDaily,
      }),
      isDirectionHorizon () {
        return this.direction === this.loadingArea.config.direction.horizon
      },
      isDataEmpty () {
        return _.isEmpty(this.cardData)
      },
      getChartValue () {
        return this.cardData.name === 'CONNTM'
          ? _.round(Number(this.cardData.value)/3600, 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : (['PUR', 'NPUPUR', 'RPUPUR'].includes(this.cardData.name)
            ? this.cardData.value
            : this.mixinNumberWithCommas(this.cardData.value))
        // return this.cardData.value === '' ? '' : (this.cardData.name === 'CONNTM' ? _.round(Number(this.cardData.value)/3600, 2) : this.mixinNumberWithCommas(this.cardData.value))
      },
      getTooltipValue () {
        return this.cardData.name === 'CONNTM'
          ? _.round(Number(this.cardData.value)/3600, 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : this.cardData.name === 'PUR'
            ? this.cardData.value
            : this.mixinNumberWithCommasToString(Number(this.cardData.value))
      },
      getChartName () {
        return `${(this._nickNames[this.cardData.name]? this._nickNames[this.cardData.name]: (!_.isEmpty(this.cardData.name) ? this.cardData.name : '') )}`
        // return `${!this.isDaily && ['NRU', 'DLCNT', 'SALE', 'PU'].includes(this.cardData.name)? 'Monthly ' : ''}${(this._nickNames[this.cardData.name] ? this._nickNames[this.cardData.name] : this.cardData.name )}`
      },
      getChartNameNoData () {
        return `${(this._nickNames[_.upperCase(this.name)] ? this._nickNames[_.upperCase(this.name)] : this.name )}`
        // return `${!this.isDaily && ['NRU', 'DLCNT', 'SALE', 'PU'].includes(this.cardData.name)? 'Monthly ' : ''}${(this._nickNames[this.cardData.name] ? this._nickNames[this.cardData.name] : this.cardData.name )}`
      },
      getSignTxt () {
        return this.cardData.signTxt === 'TRUE' || ['ARPAU', 'ARPPU', 'NPUARPPU', 'RPUARPPU'].includes(this.cardData.name) ? this.mixinGetSignTxt() : ''
      },
      getUnitTxt () {
        return this.cardData.name === 'CONNTM' ? 'h' : ['PUR', 'NPUPUR', 'RPUPUR'].includes(this.cardData.name) ? '%' : this.mixinGetUnitTxt(this.cardData.value)
      },
      getTooltipUnitTxt () {
        return this.cardData.name === 'CONNTM' ? 'h' : ['PUR', 'NPUPUR', 'RPUPUR'].includes(this.cardData.name) ? '%' : ''
      },
      getFontSize () {
        const target = [
          // 'MTDAU', 'MTDACCESSUSER', 'MTDSALE', 'MTDREVENUE',
          'STU', 'CBU', 'NRU',
          'ARPAU', 'ARPPU', 'PUR',
          'NPUPUR', 'RPUPUR', 'NPUARPPU', 'RPUARPPU',
          // 'MTDNRU',
          // 'TOTAU', 'TOTDLCNT',
          // 'TOTSALE'
        ]
        return this.objId !== '01' && _.includes(target, this.cardData.name) ? 'font-size: 12px !important;' : ''
      }
    },
    created () {
      this.init()
      try {
        this.initToolTip()
      } catch (e) {}
      const checkIsLoading = setInterval( () => {
        this.isLoading = this._nowCallApiList.includes(this.objId)
        if (!this.isLoading && _.isEmpty(this.data)) this.cardData = this.noData
        if (!_.isEmpty(this.cardData)) {
          clearInterval(checkIsLoading)
          this.isLoading = false
        }
      }, 500)
    },
    mounted () {
      if (document.getElementsByClassName('get_height_innerChart_area')[0]) {
        this.innerChart.height = (this.options.series) ? `${document.getElementsByClassName('get_height_innerChart_area')[0].offsetHeight}px` : ''
      }
    },
    methods: {
      init () {
        this.alignSize()
      },
      initToolTip () {
        this.tooltipBase.stu.glossaryId = this.isDaily ? 46 : 94
        this.tooltipBase.nru.glossaryId = this.isDaily ? 44 : 92
        this.tooltipBase.cbu.glossaryId = this.isDaily ? 45 : 93
        this.mixinGetGlossary({ids: this.tooltipBase[this.name].glossaryId}).then( res => {
          // console.log('res: ', res)
          if (!_.isEmpty(res)) {
            const tmpTooltip = _.cloneDeep(res[0].tooltip).replace(/\./gi, '.<br/>')
            res[0].tooltip = tmpTooltip
            this.tooltip = res[0]
            // console.log('this.tooltip: ', this.tooltip)
          } else {
            console.log(`${this.name} / ${this.tooltipBase[this.name].glossaryId} / then res: `, res)
          }
        })
        // this.mixinGetGlossary({ids: this._glossaryBase.kpi[this.name].glossaryId}).then( res => {
        //   console.log(`${this.name} then res: `, res)
        //   this.tooltip = res[0]
        // })
      },
      alignSize () {
        if (this.isDirectionHorizon) this.loadingArea.height = this.loadingArea.config.horizon.height
        if (!_.isEmpty(this.options)) this.innerChartIsLoading = false
      },
      getStatusTooltipValue (over) {
        return this.data.name === 'CONNTM'
          ? _.round(Number(over)/3600, 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : this.mixinNumberWithCommasToString(over)
      },
      async windowResize () {
        // basicInfoChart (숫자형)
        const tmp = await document.getElementsByClassName(`get_data_value_offset_${this.getChartName}_${Number(this.data.value)}`)
        if (tmp && tmp.length > 0) {
          _.toString(this.getChartValue).length > 2
          ? this.customMarginLeft = (await tmp[0].offsetLeft) * 0.7 - 10
          : this.customMarginLeft = (await tmp[0].offsetLeft) * (this.hasRevenue ? 0.6 : 0.8 )- 10
        }
        // innerChart (하이차트)
        this.innerChartIsLoading = await true
        this.innerChartIsLoading = await false
      }
    }
  }
</script>
<style>
.tooltip.popover .popover-inner {
  /* background-color: #FFFFFFE6 !important;
  border:1px solid green !important;
  padding: 5px 8px !important;
  border-radius: 1px !important; */
  min-width: 100px;
  height: 62px;
  opacity: 0.95;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #6fc765;
  background-color: #ffffff;
  color: #212121;
  font-size: 13px;
  line-height: 20px;
  padding: 9px 9px;
  z-index: 100;
  text-align: left;
}
.custom_margin_top_zero { 
  margin-top: 0px !important;
}
</style>

