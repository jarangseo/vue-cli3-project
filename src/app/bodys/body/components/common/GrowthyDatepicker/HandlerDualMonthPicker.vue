<template>
<!-- [D] 노출시 display:block 로 변경 필요 -->
<div class="set_layer_growthy start_end_month" style="display:block">
    <div class="setting_group">
        <div class="set_first">
          <growthy-month-picker
            :dates="dates"
            :calType="'double'"
            :dateType="'start'"
            :isOpen="true"
            :isShowTime="false"
            :availableDates="availableDates"
            :scope="scope"
            :parent="parent"
          ></growthy-month-picker>
        </div>
        <div class="set_second">
          <growthy-month-picker
            :dates="dates"
            :calType="'double'"
            :dateType="'end'"
            :isOpen="true"
            :isShowTime="false"
            :availableDates="availableDates"
            :scope="scope"
            :parent="parent"
          ></growthy-month-picker>

        </div>
        <div class="set_third">
            <div class="inner_date_set">
                <dl>
                    <dt>From</dt>
                    <dd><input type="text" class="set_date_val" v-model="cDates[0]" readonly="readonly"></dd>
                </dl>
                <dl>
                    <dt>To</dt>
                    <dd><input type="text"  class="set_date_val" v-model="cDates[1]" readonly="readonly"></dd>
                </dl>
            </div>
        </div>
    </div>
    <div class="btn_group">
        <span class="action_info" style="margin-right: 10px;">* {{ maxString }}</span>
        <div class="action_btn">
            <a @click="cancel()" class="btn cancel">CANCEL</a>
            <a @click="applyDates()" class="btn apply">APPLY</a>
        </div>
    </div>
</div>
<!-- [D] 노출시 display:block 로 변경 필요 -->
</template>
<script>
import GrowthyMonthPicker from './GrowthyMonthPicker.vue'
import moment from 'moment'
import { util } from '@/shared/utils/util'

export default {
  name: 'HandlerDualMonthPicker',
  components: {
    GrowthyMonthPicker
  },
  props: {
    dates: {
      type: Array,
      default: () => { return [] }
    },
    availableDates: {
      type: Array,
      default: () => { return [] }
    },
    isOpenCalendar: {
      type: Boolean,
      default: false
    },
    setDates: {
      type: Function,
      default: () => {}
    },
    toggleCalander: {
      type: Function,
      default: () => {}
    },
    cancelDualPicker: {
      type: Function,
      default: () => {}
    },
    maxRange: {
      type: Number,
      default: 12
    },
    scope: {
      type: Number,
      default: 0
    },
    parent: {
      type: String,
      default: 'dataHandler'
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    maxString() {
      return util.replaceWords(this.$store.state.common._lang.dataBySelectedLang.analytics_handler_msg_maxdate, [{'{@max_period}': `${this.scope} Months`}])
    }
  },
  watch: {
    dates (d) {
      let lastMonth = d[1]
      let maxStartMonth = moment(d[1]).subtract(100, 'years').format('YYYY-MM')
      this.cDates = d
      this.availableDates.push(maxStartMonth)
      this.availableDates.push(lastMonth)
    }
  },
  data () {
    return {
      cDates: []
    }
  },
  methods: {
    monthOk (year, month, type) {
      if (type === 'start') {
        this.$set(this.cDates, 0, moment(year + month + '01').format('YYYY-MM'))
      } else {
        this.$set(this.cDates, 1, moment(year + month + '01').format('YYYY-MM'))
      }
    },
    applyDates () {
      if (util.isBeforeMaxRange('months', this.maxRange, this.cDates)) {
        return util.toastr().error('최대 설정 가능한 범위를 벗어났습니다.')
      }
      this.setDates(this.cDates)
      this.toggleCalander()
      this.setUpdatedFlag(true)
    },
    cancel () {
      this.cancelDualPicker()
    }
  },
  mounted () {
    this.cDates = this.dates
  }
}
</script>
