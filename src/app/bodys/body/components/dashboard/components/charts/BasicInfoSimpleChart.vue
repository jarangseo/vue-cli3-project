<template>
  <div :class="className">
    <div class="chart_info_data">
      <div class="data_value" style="cursor:pointer !important;">
        <v-popover offset="0" trigger="hover" placement="bottom">
          <span class="sign_txt">{{ data.signTxt }}</span>
          {{ mixinNumberWithCommasToString(data.value) }}
          <span class="unit_txt"></span>

          <template slot="popover" class="custom_tooltip">
            <div>
              <p style="fontWeight:bolder;">
                {{ mixinChangeDateForm(data.trendData[0].days) }}
                <!-- {{ _currentDates.selectedDates[0].replace(/-/gi, '') }} -->
              </p>
              <p style="padding-top: 3px;">{{ data.signTxt }} {{ mixinNumberWithCommasToString(data.value) }} {{ getTooltipUnitTxt }} </p>
            </div>
          </template>
        </v-popover>
      </div>
    </div>
    <div class="chart_info_variation">
      <ul>
        <!-- [D] 상승 : increase, 감소 : decrease, 유지 : maintain 클래스 추가해주세요 -->
        <template v-for=" (item, index) in data.trendData">
          <li :class="item.status" :key="`basic-simple-${index}`" style="cursor:pointer !important;">
            <v-popover offset="0" trigger="hover" placement="bottom">
              <span class="cycle_info"><span class="blind">{{ item.type }}</span>{{ item.code }}</span>
              <span class="variation_mark"><span class="blind">{{ item.status }}</span></span>
              <span class="variation_data">{{ Math.abs(item.value) }}%</span>

              <template slot="popover" class="custom_tooltip">
                <div>
                  <p style="fontWeight:bolder;">
                    {{ mixinChangeDateFormYesterday(item.days) }}
                  </p>
                  <p style="padding-top: 3px;">
                    {{ item.signTxt }} {{ item.days !== '' ? mixinNumberWithCommasToString(item.over) : 'Network Error' }} {{ getTooltipUnitTxt }}
                  </p>
                </div>
              </template>
            </v-popover>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'BasicInfoSimpleChart',
    mixins: [ dashboardMixin ],
    props: {
      data: {
        type: Object,
        required: false,
        default: () => {
          return {
            name: '',
            signTxt: '',
            trendData: [{
              code:"D",
              days:"20190401",
              over:"71995",
              status:"increase",
              type:"daily",
              value:"17.84"
            }],
            unitTxt: '',
            value: 67477
          }
        }
      },
      className: {
        type: String,
        required: false,
        default: 'chart_elapsed type_left'
      }
    },
    components: {},
    watch: {},
    data () {return {
    }},
    computed: {
      getSignTxt () {
        return this.data.signTxt === 'TRUE' || ['ARPAU', 'ARPPU', 'NPUARPPU', 'RPUARPPU'].includes(this.data.name) ? this.mixinGetSignTxt() : ''
      },
      getUnitTxt () {
        return this.data.name === 'CONNTM' ? 'h' : ['PUR', 'NPUPUR', 'RPUPUR'].includes(this.data.name) ? '%' : this.mixinGetUnitTxt(this.data.value)
      },
      getTooltipUnitTxt () {
        return this.data.name === 'CONNTM' ? 'h' : ['PUR', 'NPUPUR', 'RPUPUR'].includes(this.data.name) ? '%' : ''
      },
    },
    created () {
      this.init()
    },
    mounted () {},
    methods: {
      init () {
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

