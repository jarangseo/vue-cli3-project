<template>
<div class="set_date growthy-datepicker-wrapper">
  <div class="handler-datepicker" v-if="dateCode === 'DA01'">
    <div class="date_area">
        <i class="fn-map-018-date_range fn-18 fn-map"></i>
        <a @click="toggleCalander()">{{cDates[0]}}</a>
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup" v-show="isOpenCalendar" tabIndex="-1">
        <template>
          <single-calender
            v-if="cDates[0] !== ''"
            :alreadySelectedDates="cDates"
            :endType="date"
            :setUpdatedFlag="setUpdatedFlag"
          ></single-calender>
        </template>
      </div>
    </transition>
  </div>
  <div class="handler-picker" v-if="dateCode === 'DA02'">
    <div class="date_area">
        <i class="fn-map-018-date_range fn-18 fn-map"></i>
        <a @click="toggleCalander()">{{moment(cDates[0]).format('YYYY-MM')}}</a>
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup" v-show="isOpenCalendar" tabIndex="-1">
        <!-- [D] 노출시 display:block 로 변경 필요 -->
        <div class="growthy-datepicker-calendar set_layer_growthy month" style="display:block">
          <div class="setting_group" style="float:left;display:inline-block;">
              <div class="set_first">
                <template>
                  <growthy-month-picker
                    :dates="cDates"
                    :calType="'single'"
                    :dateType="'start'"
                    :isOpen="isOpenCalendar"
                    :isShowTime="isShowTime"
                    :availableDates="availableDates"
                    :scope="scope"
                    :parent="parent"
                    :setUpdatedFlag="setUpdatedFlag"
                    :isDashboard="date === 'DASHBOARD' ? true : false"
                  ></growthy-month-picker>
                </template>
              </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div class="handler-picker" v-if="dateCode === 'DA03'">
    <div class="date_area">
        <i class="fn-map-018-date_range fn-18 fn-map"></i>
        <a @click="toggleCalander()">{{cDates[0] +  ' ~'  + cDates[1]}}</a>
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup datepicker-popup-da03" v-show="isOpenCalendar" tabIndex="-1">
        <double-calender
          :alreadySetDate="cDates"
          :toggleCalender="toggleCalander"
          :cancelDualPicker="cancelDualPicker"
          :scope="maxRange"
          :parent="parent"
          :to="to"
          :maxRange="maxRange > 0 ? maxRange - 1 : 0"
          :from="from"
          :setUpdatedFlag="setUpdatedFlag"
        ></double-calender>
      </div>
    </transition>
  </div>
  <div class="handler-picker" v-if="dateCode === 'DA04'">
    <div class="date_area">
        <i class="fn-map-018-date_range fn-18 fn-map da04"></i>
        <a @click="toggleCalander()">{{cDates[0] +  ' ~'  + cDates[1]}}</a>
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup datepicker-popup-da04" v-show="isOpenCalendar" tabIndex="-1">
        <handler-dual-month-picker
          :dates="cDates"
          :time="false"
          :setDates="setDates"
          :isOpenCalendar="isOpenCalendar"
          :toggleCalander="toggleCalander"
          :scope="maxRange"
          :maxRange="maxRange > 0 ? maxRange - 1 : 0"
          :cancelDualPicker="cancelDualPicker"
          :parent="parent"
          :setUpdatedFlag="setUpdatedFlag"
        ></handler-dual-month-picker>
      </div>
    </transition>
  </div>
  <div class="handler-picker" v-if="dateCode === 'DA05'">
    <div class="date_area">
      <i class="fn-map-018-date_range fn-18 fn-map da05"></i>
      <a @click="toggleCalander()">{{cDates[0] +  ' ~'  + cDates[1]}}</a>
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup datepicker-popup-da04" v-show="isOpenCalendar" tabIndex="-1">
        <handler-dual-time-picker
          :alreadySetDate="cDates"
          :toggleCalender="toggleCalander"
          :cancelDualPicker="cancelDualPicker"
          :scope="maxRange"
          :parent="parent"
          :from="from"
          :maxRange="maxRange"
          :isOpenCalendar="isOpenCalendar"
          :setUpdatedFlag="setUpdatedFlag"
        ></handler-dual-time-picker>
      </div>
    </transition>
  </div>
  <div
    class="dimmed-handler-date-picker"
    v-if="isOpenCalendar && parent === 'dataHandler'"
    @click="closeCalendarDimmed"
  ></div>
</div>
</template>
<script>
import moment from 'moment'
import SingleCalender from './SingleCalender.vue'
import GrowthyMonthPicker from './GrowthyMonthPicker.vue'
import DoubleCalender from './DoubleCalender.vue'
import HandlerDualMonthPicker from './HandlerDualMonthPicker.vue'
import HandlerDualTimePicker from './HandlerDualTimePicker.vue'
import _ from 'lodash'
import * as types from '@/shared/stores/types'
import { mapState } from 'vuex'

export default {
  name: 'HandlerDatePicker',
  components: {
    GrowthyMonthPicker,
    HandlerDualMonthPicker,
    SingleCalender,
    DoubleCalender,
    HandlerDualTimePicker
  },
  watch: {
    isOpenPivotCalender (d) {
      if (d === false) {
        this.isOpenCalendar = false
      } else {
        // this.setCDates()
      }
    },
    selectedDates (d) {
      if (d.length === 0) {
        this.cDates = []
      } else if (d.length === 2) {
        if (this.showingFormat === 'YYYY-MM') {
          this.cDates = [moment(d[0].replace('-', '') + '01').format(this.showingFormat), moment(d[1].replace('-', '') + '01').format(this.showingFormat)]
        } else {
          this.cDates = [moment(d[0]).format(this.showingFormat), moment(d[1]).format(this.showingFormat)]
        }
      }
      this.backupStartDate = this.cDates[0]
      this.backupEndDate = this.cDates[1]
      this.$forceUpdate()
    },
    _activeModal (activeModal) {
      if (activeModal !== this.$options.name && this.isOpenCalendar) {
        this.toggleCalander()
      }
    }
  },
  props: {
    dateCode: {
      type: String,
      default: ''
    },
    setHandlerDate: {
      type: Function,
      default: () => {}
    },
    selectedDates: {
      type: Array,
      default: () => {
        return []
      }
    },
    isOpenPivotCalender: {
      type: Boolean,
      default: false
    },
    showingFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    maxRange: {
      type: Number,
      default: 30
    },
    from: {
      type: Number,
      default: 0
    },
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    parent: {
      type: String,
      default: 'dataHandler'
    },
    to: {
      type: String,
      default: 'SD01'
    },
    date: {
      type: String,
      default: 'SD01'
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    },
    availableDates: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cDates: [],
      dates: [],
      isOpenCalendar: false,
      isShowTime: false,
      activeCalendar: 'single',
      scope: 0,
      backupStartDate: '',
      backupEndDate: ''
    }
  },
  computed: {
    moment () {
      return moment
    },
    _ () {
      return _
    },
    ...mapState({
      _activeModal: state => state.common._activeModal
    })
  },
  methods: {
    setCDates () {
      switch (this.dateCode) {
        case 'DA01':
          this.cDates = _.map(this.cDates, date => {
            return moment(date).format('YYYY-MM-DD')
          })
          break
        case 'DA02':
          this.cDates = _.map(this.cDates, date => {
            return this.date === 'DASHBOARD' && moment().format('YYYY-MM') === date
                    ? moment(date).subtract(1, 'm').format('YYYY-MM')
                    : moment(date).format('YYYY-MM')
          })
          break
        case 'DA03':
          this.cDates = _.map(this.cDates, date => {
            return moment(date).format('YYYY-MM-DD')
          })
          break
        case 'DA04':
          this.cDates = _.map(this.cDates, date => {
            return moment(date).format('YYYY-MM')
          })
          break
        case 'DA05':
          this.cDates = _.map(this.cDates, date => {
            return moment(date).format('YYYY-MM-DD HH:mm')
          })
          break
      }
      this.$forceUpdate()
    },
    toggleCalander () {
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
      this.isOpenCalendar = !this.isOpenCalendar
      this.parent === 'pivotSetting' && this.$root.componentsName.PivotSetting ? this.$root.componentsName.PivotSetting.isOpenPivotCalender = this.isOpenCalendar : ''
    },
    cancelDualPicker () {
      let dates = []
      // let start = this.showingFormat === 'YYYY-MM' ? this.backupStartDate + '01' : this.backupStartDate
      // let end = this.showingFormat === 'YYYY-MM' ? this.backupEndDate + '01' : this.backupEndDate
      // dates = [moment(start).format(this.showingFormat), moment(end).format(this.showingFormat)]
      dates = [this.backupStartDate, this.backupEndDate]
      this.ok(dates, 'dual')
      this.isOpenCalendar = false
      this.parent === 'pivotSetting' && this.$root.componentsName.PivotSetting ? this.$root.componentsName.PivotSetting.isOpenPivotCalender = this.isOpenCalendar : ''
    },
    ok (dates) {
      const currentCalendar = this.activeCalendar
      const format = 'YYYY-MM-DD HH:mm'
      this.backupStartDate = dates[0]
      this.backupEndDate = dates[1]
      this.$set(this.cDates, 0, dates[0])
      this.$set(this.cDates, 1, dates[1])
      if (!this.isShowTime) {
        this.toggleCalander(currentCalendar)
        if (currentCalendar === 'start') {
          this.toggleCalander('end')
        }
      }
      this.setHandlerDate(this.cDates)
    },
    setDates (dates) {
      this.backupStartDate = this.cDates[0]
      this.backupEndDate = this.cDates[1]
      this.cDates = _.cloneDeep(dates)
      this.setHandlerDate(this.cDates)
    },
    monthOk (year, month) {
      let start = moment(year + '-' + month + '-' + '01').format('YYYY-MM')
      let end = moment(year + '-' + month + '-' + '01').format('YYYY-MM')
      this.cDates = [start, end]
      this.toggleCalander()
      this.setHandlerDate(this.cDates)
    },
    setDefaultDates (d) {
      this.cDates = _.map(d, o => {
        return moment(o).format(this.showingFormat)
      })
      this.setCDates()
    },
    closeCalendarDimmed () {
      // this.isOpenCalendar = false
      const dateCode = this.dateCode
      if (dateCode !== 'DA01' && dateCode !== 'DA02') {
        this.cancelDualPicker()
      }else {
        this.isOpenCalendar = false
        if (this.date === 'DASHBOARD') this.initSingleCalendar()
      }
    },
    async initSingleCalendar () {
      const tmp = await _.cloneDeep(this.cDates)
      this.cDates = await []
      this.cDates = await tmp
    }
  },
  mounted () {
    this.setDefaultDates(this.selectedDates)
  }
}
</script>
<style lang="scss" scoped>
  .divider {
    width: 100%;
    height:2px;
    background-color: #eaeaea;
    margin: 10px 0;
  }
  .growthy-datepicker-wrapper {
    display:inline-block;
    position:relative;
    font-family:'Roboto',Arial, sans-serif;
    vertical-align: middle;
  }
  .growthy-datepicker-wrapper input {
    font-family:'Roboto',Arial, sans-serif;
  }
  .growthy-datepicker {
    display: inline-block;
    position: relative;
    vertical-align: top;
    // background-color: #fafafa;
  }
  .growthy-datepicker .single-datepicker {
    width: 230px;
    height: 32px;
    line-height: 32px;
  }
  .growthy-datepicker .single-datepicker.with-timepicker {
    width: 230px;
    // background-color: #fafafa;
    height: 32px;
    line-height: 32px;
  }
  .growthy-datepicker .range-datepicker.with-timepicker .range-date-input {
    // width: 190px;
  }
  .growthy-datepicker .range-datepicker {
    display: inline-block;
    line-height: 28px;
    vertical-align: top;
    // background-color: #fafafa;
  }
  .growthy-datepicker .range-datepicker.with-timepicker {
    display: inline-block;
        // background-color: #fafafa;
  }
  .growthy-datepicker.disabled {
    // background-color: #e5e5e5;
  }

  .growthy-datepicker.disabled .range-datepicker .start-date,
  .growthy-datepicker.disabled .range-datepicker .end-date,
  .growthy-datepicker.disabled .single-datepicker
  {
    background-color: #e5e5e5;
  }

  .growthy-datepicker .range-datepicker .start-date,
  .growthy-datepicker .range-datepicker .end-date
   {
    display:inline-block;
    position:relative;
    background-color: #fafafa;
    height: 28px;
    line-height: 28px;
    width:190px;
    vertical-align: top;
  }

  .growthy-datepicker .range-datepicker .start-date:before,
  .growthy-datepicker .range-datepicker .end-date:before
   {
    content: '';
    display: block;
    position: absolute;
    top: 7px;
    right: 11px;
    width: 16px;
    height: 16px;
    background: url("~@/assets/img/gia-map-img.png");
    background-position: -377px -28px;
    box-sizing: border-box;
  }

  .growthy-datepicker {
    .single-datepicker {
      background-color: #fafafa;
      .datepicker-close {
        display: none;
      }
    }
  }

  .btn-toggle-picker {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 0px;
    left: 0px;
    background-color: #7eca0f;
    border-radius: 4px 0 0px 4px;
    border:1px solid #6eba01;
    box-sizing: border-box;
    z-index: 1;
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 7px;
      left: 8px;
      width: 16px;
      height: 16px;
      background: url("~@/assets/img/gia-map-img.png") -377px -28px;
      z-index: 10;
    }
  }
  .datepicker__clearable:hover:before {
    display: none;
  }
  .datepicker__clearable:hover .datepicker-close{
    display: block;
  }
  .datepicker-close:hover:before{
    background-color: #afafaf;
  }
  .growthy-datepicker .single-datepicker > input,
  .growthy-datepicker .range-datepicker > div > input
  {
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    width: 100%;
    height: 100%;
    padding: 0 12px 0 44px;
    // padding: 0 34px 0 12px;
    font-size: 12px;
    color: #32353b;
    font-weight: 400;
    border-radius: 4px;
    border: solid 1px #cccccc;
    background-color: #ffffff;
    // background-color: transparent;
    // background-color: #fafafa;
    // border-top:1px solid #c2c2c2;
    // border-right:1px solid #e8e8e8;
    // border-bottom:1px solid #e8e8e8;
    // border-left:1px solid #cdcdcd;
    box-sizing: border-box;
    outline: none;
    transition: all 200ms ease;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;

    &[disabled]{
      // cursor: default;
      color: rgba(0,0,0,.3);
    }
  }
  .datepicker-popup {
    // overflow: hidden;
    position: absolute;
    top:65px;
    left:-26px;
    padding: 0px;
    // margin-top: -1px;
    margin-bottom: 20px;
    font-size: 12px;
    background: #fff;
    // border: 1px solid #cacaca;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 10px 0 rgba(0, 0, 0, 0.06), 0 4px 5px 0 rgba(0, 0, 0, 0.14);
    outline: 0;
    transition: all 200ms ease;
    opacity: 1;
    transform: scaleY(1);
    transform-origin: center top;
    box-sizing: border-box;
    z-index: 999;
  }

.datepicker-range {
  min-width: 325px
}
.datepicker-range .datepicker-popup{
  width: 403px;
}
.datepicker-bottom {
  float: left;
  width: 100%;
  text-align: right;
}
.datepicker-btn {
  padding: 5px 10px;
  background: #1284e7;
  color: #fff;
  border-radius: 2px;
  display: inline-block;
  cursor: pointer;
}
.datepicker-anim-enter-active {
  transform-origin: 0 0;
  animation: datepicker-anim-in .2s cubic-bezier(.23, 1, .32, 1)
}
.datepicker-anim-leave-active {
  transform-origin: 0 0;
  animation: datepicker-anim-out .2s cubic-bezier(.755, .05, .855, .06)
}
.datepicker-popup.datepicker-popup-da03 {
  width: 760px;
  left: -400px !important;
}
.datepicker-popup.datepicker-popup-da04 {
  width: 760px;
  left: -400px !important;
}
.dimmed-handler-date-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
}
@keyframes datepicker-anim-in {
  0% {
    opacity: 0;
    transform: scaleY(.8)
  }
  to {
    opacity: 1;
    transform: scaleY(1)
  }
}
@keyframes datepicker-anim-out {
  0% {
    opacity: 1;
    transform: scaleY(1)
  }
  to {
    opacity: 0;
    transform: scaleY(.8)
  }
}
</style>
