<template>
  <div class="set_layer_growthy start_end_date" style="display:block;">
    <div class="setting_group">
      <div class="set_first">
        <div class="calendar_area" style="padding: 0 !important;">
          <div class="month_calendar">
            <div class="growthy-datepicker-calender">
              <div class="calender">
                <div class="calender-head">
                  <span class="calender-prev-year-btn" @click="firstYear--"></span>
                  <span class="calender-prev-month-btn" @click="fpm"></span>
                  {{firstYear}}{{local.yearSuffix}}.{{local.monthsHead[firstMonth]}}
                  <span class="calender-next-month-btn" @click="fnm"></span>
                  <span class="calender-next-year-btn" @click="firstYear++"></span>
                </div>
                <div class="calender-body">
                  <div class="calender-days">
                    <span class="calender-week" v-for="(i, key) in local.weeks" :key="key + '1'">{{i}}</span>
                    <span
                      class="calender-week"
                      v-for="(date, key) in fdays"
                      @click="setStartDate($event, date.y, date.m, date.i)"
                      :class="[(date.p || date.n)?`calender-date-out` :'', fstatus(date.y, date.m, date.i)]"
                      :key="key + '2'"
                    >
                      {{date.i}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="set_second">
        <div class="calendar_area" style="padding: 0 !important;">
          <div class="month_calendar">
            <div class="growthy-datepicker-calender">
              <div class="calender">
                <div class="calender-head">
                  <span class="calender-prev-year-btn" @click="secondYear--"></span>
                  <span class="calender-prev-month-btn" @click="spm"></span>
                  {{secondYear}}{{local.yearSuffix}}.{{local.monthsHead[secondMonth]}}
                  <span class="calender-next-month-btn" @click="snm"></span>
                  <span class="calender-next-year-btn" @click="secondYear++"></span>
                </div>
                <div class="calender-body">
                  <div class="calender-days">
                    <span class="calender-week" v-for="(i, key) in local.weeks" :key="key + '1'">{{i}}</span>
                    <span
                      class="calender-week"
                      v-for="(date, key) in sdays"
                      @click="setEndDate($event, date.y, date.m, date.i)"
                      :class="[(date.p || date.n)?`calender-date-out` :'', sstatus(date.y, date.m, date.i)]"
                      :key="key + '2'"
                    >
                      {{date.i}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="set_third">
        <div class="inner_date_set">
            <dl>
                <dt>From</dt>
                <dd><input type="text" class="set_date_val" v-model="startDate" readonly="readonly"></dd>
            </dl>
            <dl>
                <dt>To</dt>
                <dd><input type="text"  class="set_date_val" v-model="endDate" readonly="readonly"></dd>
            </dl>
        </div>
      </div>
    </div>
    <div class="btn_group">
        <span class="action_info" style="margin-right: 10px;">* {{ maxString }}</span>
        <div class="action_btn">
            <a @click="innerToggleCalender" class="btn cancel" style="margin-right: 5px;">CANCEL</a>
            <a @click="applyDate" class="btn apply">APPLY</a>
        </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { util } from '@/shared/utils/util'

export default {
  name: 'DoubleCalender',
  watch: {
    alreadySetDate(d) {
      if (d && d.length === 2) {
        this.initData()
      }
    }
  },
  props: {
    scope: {
      type: Number,
      default: 30
    },
    alreadySetDate: {
      type: Array,
      default: () => {
        return []
      }
    },
    toggleCalender: {
      type: Function,
      default: () => {}
    },
    cancelDualPicker: {
      type: Function,
      default: () => {}
    },
    to: {
      type: String,
      default: 'SD01'
    },
    from: {
      type: Number,
      default: 30
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    },
    maxRange: Number
  },
  computed: {
    local () {
      return {
        dow: 7,
        yearSuffix: '',
        monthsHead: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        weeks: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      }
    },
    fdays () {
      const days = []
      const year = this.firstYear
      const month = this.firstMonth
      const time = moment([year, month, 1])
      const dow = this.local.dow || 7
      let lastDay
      let week
      let count
      let fStartDate
      let fEndDate

      time.date(0)
      lastDay = time.date()
      week = time.day()
      count = dow <= week ? (week - dow + 1) : (week + (7 - dow + 1))
      fStartDate = this.availableDates[0]
      fEndDate = this.endDate
      while (count > 0) {
        days.push({
          i: lastDay - count + 1,
          y: month > 0 ? year : year - 1,
          m: month > 0 ? month - 1 : 11,
          p: true
        })
        count --
      }
      lastDay = time.add(2, 'months').date(0).date()
      for (let i = 1; i <= lastDay; i++) {
        days.push({
          i: i,
          y: year,
          m: month
        })
      }
      for (let i = 1; days.length < 42; i++) {
        days.push({
          i: i,
          y: month < 11 ? year : year + 1,
          m: month < 11 ? month + 1 : 0,
          n: true
        })
      }
      return days
    },
    sdays () {
      const days = []
      const year = this.secondYear
      const month = this.secondMonth
      const time = moment([year, month, 1])
      const dow = this.local.dow || 7
      let lastDay
      let week
      let count
      let sStartDate
      let sEndDate

      time.date(0)
      lastDay = time.date()
      week = time.day()
      count = dow <= week ? (week - dow + 1) : (week + (7 - dow + 1))
      while (count > 0) {
        days.push({
          i: lastDay - count + 1,
          y: month > 0 ? year : year - 1,
          m: month > 0 ? month - 1 : 11,
          p: true
        })
        count --
      }
      lastDay = time.add(2, 'months').date(0).date()
      for (let i = 1; i <= lastDay; i++) {
        days.push({
          i: i,
          y: year,
          m: month
        })
      }
      for (let i = 1; days.length < 42; i++) {
        days.push({
          i: i,
          y: month < 11 ? year : year + 1,
          m: month < 11 ? month + 1 : 0,
          n: true
        })
      }
      return days
    },
    maxString () {
      return util.replaceWords(this.$store.state.common._lang.dataBySelectedLang.analytics_handler_msg_maxdate, [{'{@max_period}': `${this.scope} Days`}])
    }
  },
  data () {
    return {
      startDate: moment().subtract(10, 'years').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      firstMonth: moment().subtract(30, 'days').month(),
      firstYear: moment().subtract(30, 'days').year(),
      secondMonth: moment().month(),
      secondYear: moment().year(),
      today: moment().format('YYYY-MM-DD'),
      todayMonth: moment().month(),
      todayYear: moment().year(),
      availableDates: []
    }
  },
  methods: {
    innerToggleCalender () {
      this.toggleCalender()
      this.cancelDualPicker()
    },
    fnm () {
      if (this.firstMonth < 11) {
        this.firstMonth++
      } else {
        this.firstMonth = 0
        this.firstYear++
      }
    },
    fpm () {
      if (this.firstMonth > 0) {
        this.firstMonth--
      } else {
        this.firstMonth = 11
        this.firstYear--
      }
    },
    snm () {
      if (this.secondMonth < 11) {
        this.secondMonth++
      } else {
        this.secondMonth = 0
        this.secondYear++
      }
    },
    spm () {
      if (this.secondMonth > 0) {
        this.secondMonth--
      } else {
        this.secondMonth = 11
        this.secondYear--
      }
    },
    fstatus (year, month, date) {
      const t = moment([year, month, date])
      let classList = []
      let startDate = moment(this.availableDates[0]).subtract(1, 'days')
      let endDate = moment(this.endDate)
      if (t.isBetween(startDate, endDate, null, '[]')) {
        classList.push('calender-date')
      }
      if (t.isSame(moment(this.startDate))) {
        classList = []
        classList.push('calender-date-selected')
      }
      return classList.toString()
    },
    sstatus (year, month, date) {
      const t = moment([year, month, date])
      let classList = []
      let endDate = moment(this.availableDates[1])
      if (t.isBetween(this.startDate, endDate, null, '[]')) {
        classList.push('calender-date')
      }

      if (t.isSame(moment(this.endDate))) {
        classList = []
        classList.push('calender-date-selected')
      }
      return classList.toString()
    },
    setStartDate ($event, year, month, date) {
      const t = moment([year, month, date])
      if ($event.target.classList.contains('calender-date')) {
        this.startDate = t.format('YYYY-MM-DD')
      }
    },
    setEndDate ($event, year, month, date) {
      const t = moment([year, month, date])
      if ($event.target.classList.contains('calender-date')) {
        this.endDate = t.format('YYYY-MM-DD')
        // [OGPQA-1058] 해결 위해 주석 처리
        // this.availableDates[0] = moment(this.endDate).subtract(this.maxRange, 'days')
        // if (moment(this.endDate).subtract(this.maxRange, 'days').isAfter(moment(this.startDate))) {
        //   this.startDate = moment(this.endDate).subtract(this.maxRange, 'days').format('YYYY-MM-DD')
        // }
      }
    },
    initData () {
      if (this.alreadySetDate && this.alreadySetDate.length === 2) {
        this.startDate = this.alreadySetDate[0]
        this.endDate = this.alreadySetDate[1]
      } else {
        this.endDate = this.to === 'SD01' ? moment().format('YYYY-MM-DD') : moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.startDate = moment(this.endDate).subtract(this.maxRange, 'days').format('YYYY-MM-DD')
      }
      this.firstYear = moment(this.startDate).year()
      this.firstMonth = moment(this.startDate).month()
      this.secondYear = moment(this.endDate).year()
      this.secondMonth = moment(this.endDate).month()
    },
    applyDate () {
      let dates = []
      let st = moment(this.startDate)
      let et = moment(this.endDate)

      if (util.isBeforeMaxRange('days', this.maxRange, [st, et])) {
        return util.toastr().error('최대 설정 가능한 범위를 벗어났습니다.')
      }

      dates.push(this.startDate)
      dates.push(this.endDate)
      this.$parent.ok(dates, 'dual')
      this.setUpdatedFlag(true)
    },
    setAvailableDates () {
      let maxEndDate = this.to === 'SD01' ? moment().format('YYYY-MM-DD') : moment().subtract(1, 'days').format('YYYY-MM-DD')
      let minStartDate = this.startDate
      this.availableDates = [minStartDate, maxEndDate]
      this.startDate = moment(maxEndDate).subtract(this.from, 'days').format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.setAvailableDates()
    this.initData()
  }
}
</script>
<style lang="scss" scoped>

  .hidden {
    display: none !important;
  }

  .growthy-datepicker-calender {
    display: -ms-flexbox;
    display:flex;
    //float: left;
    display: inline-block;
    width:100%;
    max-width: 430px;
    vertical-align: top;
  }
  .calender {
    float: left;
    padding:20px;
    display: inline-block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }
  .calender+.calender{
    border-left: solid 1px #eaeaea;
    margin-left: 5px;
    padding-left: 5px;
  }
  .calender-head {
    position: relative;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    font-weight: 900;
    text-align: center;
    color: #32353b;
    margin-bottom: 14px;
  }
  .calender-head span {
    position: absolute;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .calender-head span:hover {
    color: #1284e7;
  }

  .calender-head .calender-year-select,
  .calender-head .calender-month-select {
    font-size: 16px;
    padding: 0 0;
    position: relative;
  }

  .calender-prev-year-btn {
    top:2px;
    left:8px;
    width:13px;
    height:11px;
    background: url("~@/assets/img/gia-map-img.png");
    background-position: -388px -2px;
  }

  .calender-prev-decade-btn {
    left: 6px;
  }

  .calender-prev-month-btn {
    top:2px;
    left:29px;
    width: 7px;
    height:10px;
    background: url("~@/assets/img/gia-map-img.png");
    background-position: -379px -2px;
  }

  .calender-next-decade-btn {
    right: 6px;
  }

  .calender-next-year-btn {
    top:2px;
    right:8px;
    width:13px;
    height:11px;
    background: url("~@/assets/img/gia-map-img.png");
    background-position: -390px -15px;
  }

  .calender-next-month-btn {
    top:2px;
    right: 28px;
    width: 7px;
    height: 10px;
    background: url("~@/assets/img/gia-map-img.png");
    background-position: -379px -15px;
  }

  .calender-body {
    position: relative;
    width: 224px;
    height: 144px;
    // width: 196px;
    // height: 144px;
  }

  .calender-days {
    width: 100%;
    height: 100%;
  }

  .calender-week,
  .calender-date {
    overflow: hidden;
    float: left;
    display: inline-block;
    vertical-align: middle;
    // width: 14.29%;
    // height: 16.5%;
    width: 32px;
    height: 28px;

    text-align: center;
    box-sizing: border-box;
    line-height: 100%;
    &:before {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }

  .calender-week {
    color: #9e9e9e;
    font-weight: normal;
    font-size: 11px;
    &:nth-child(-n+7){
      margin-bottom: 2px;
      // color:#ff4e80;
    }
  }

  //기본 날짜
  .calender-date {
    cursor: pointer;
    color:#212121;
    font-weight: 400;
    font-weight: normal;
    font-size: 12px;

    &:nth-last-child(7n){
      color: #d0021b;
    }

    &.calender-date-covered {
      //  background-color: #f2faf1;
       background-color: rgba(230, 245, 228, 0.5);
      &:hover {
        border: 1px solid #00b900;
        // background: transparent;
        // background-color: #f2f4f7;
      }
    }

    &.calender-date-selected {
      color: #fff;
      font-weight: bold;
      background-color: #00b900 !important;
      zoom: 1; /* ie 5,6,7 bug fix */
      filter: alpha(opacity=100) !important;
      opacity: 1!important;
    }

     &.calender-date-disabled {
        cursor: not-allowed !important;
        // background-color: #fafafa;
        // color: rgba(0, 0, 0, 0.2);
        // opacity: 0.5;
        // color: #bcbcbc !important;
        // background: #f3f3f3 !important;
        zoom: 1; /* ie 5,6,7 bug fix */
        filter: alpha(opacity=20);
        opacity: 0.2;

        background-color:rgba(0, 0, 0, 0.1);
      }

   &.calender-date-out {
        zoom: 1; /* ie 5,6,7 bug fix */
        filter: alpha(opacity=50);
        opacity: 0.5;
        background-color:#fff;
      // color: #ccc;
    }
  }

  .calender-date-selected,
  .calender-date-selected:hover {
    color: #fff !important;
    font-weight: bold;
    background-color: #00b900;
  }

  .calender-title {
    margin-top: -30px;
    height: 30px;
    line-height: 30px;
    background: #fff;
    text-align: center;
    font-weight: bold;
  }

  .calender-date-selected,
  .calender-date-selected:hover {
    color: #fff !important;
    font-weight: bold;
    background-color: #00b900;
  }

  .timepicker-wrapper {
    width: 161px;
    height: 224px;
    // margin:20px 0 0 236px;
    margin:20px 0 0 265px;
    padding:0 20px 20px 20px;
    border-left: 1px solid #eaeaea;
    box-sizing: border-box;
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  }

  // .timepicker-wrapper::after {
  //   content: '';
  //   display: table;
  //   clear: both;
  // }

  .timepicker {
    margin:0;
  }

  .timepicker-wrapper .name p {
    margin:-1px 0 0 0;
    padding: 0 0 7px 0;
    text-align: center;
    font-weight: bold;
    font-weight: 900;
    font-size: 14px;
    line-height: 100%;
    color: #32353b;
  }
  // .timepicker .time-input {
  //   // width: 100%;
  //   // height: 28px;
  //   // padding: 0 0 0 13px;
  //   // font-size: 12px;
  //   // color: #bdbdbd;
  //   // // font-weight: 400;
  //   // border: 1px solid #ccc;
  //   // border-radius: 4px;
  //   // box-sizing: border-box;
  //   // -ms-user-select: none;
  //   // -moz-user-select: none;
  //   // -webkit-user-select: none;
  //   // user-select: none;
  //   // outline: none;
  //   // transition: all 200ms ease;
  //   &:-webkit-input-placeholder{
  //       color:#ff0000;
  //       font-size: 12px;
  //       display: inline-block;
  //       width: 100%;
  //     }
  //     &:-ms-input-placeholder{
  //       color:#ff0000;
  //       font-size: 12px;
  //     }
  //     &:-moz-input-placeholder{
  //       color:#ff0000;
  //       font-size: 12px;
  //     }
  //     &::placeholder{
  //       color:#ff0000;
  //     }
  // }

    .timepicker input[type="text"] {
      &.time-input {
        width: 100%;
        height: 28px;
        padding: 0 0 0 13px;
        font-size: 12px;
        color:#757575;
        // font-weight: 400;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        box-shadow: none;
        outline: none;
        transition: all 200ms ease;
        &:-webkit-input-placeholder{
          color:#bdbdbd;
          font-size: 12px;
          display: inline-block;
          width: 100%;
        }
        &:-ms-input-placeholder{
          color:#bdbdbd;
          font-size: 12px;
        }
        &:-moz-input-placeholder{
          color:#bdbdbd;
          font-size: 12px;
        }
        &::placeholder{
          color:#bdbdbd;
          font-size: 12px;
        }
      }

      &:focus {
        box-shadow: none;
        outline:none;
      }
    }

  .timer:focus {
    outline:none;
  }
  .timepicker .timer-header {
    display:flex;
    width: 100%;
    line-height: 12px;
    font-size: 11px;
    color: #adafb3;

  }
  .timepicker .timer-header div {
    flex: 1 1 0;
    // height: 11px;
    text-align: center;
    padding: 5px 12px 3px 0;
  }
  .timepicker .timer-header .hour {
    border-left: 1px solid #cacaca;
  }
  .timepicker .timer-header .min {
    border-right: 1px solid #cacaca;
    border-left: 1px solid #e7e9eb;
  }
  .timepicker .picker {
    display: flex;
    line-height: 23px;
  }
  .timepicker {
    .hours-area, .minite-area {
      width:60px;
      min-height: 100px;
      max-height: 135px;
      text-align: center;
      border-bottom: 1px solid #cacaca;
      box-sizing: border-box;
      font-size: 11px;
      color:#32353b;
      font-weight: 400;
      .item {
        margin-right: 0;
        padding-right: 12px;
        box-sizing: border-box;
        &:hover {
          background-color: #f2f4f7;
          cursor: pointer;
        }
      }
    }
    .hours-area {
      border-left: 1px solid #cacaca;
    }
    .minite-area {
      border-right: 1px solid #cacaca;
      border-left: 1px solid #e7e9eb;
    }
  }

  .timepicker .picker .hh-wrapper {
    flex: 1 1 0;
    height: 134px;
    border-left: 1px solid #cacaca;
    border-bottom: 1px solid #cacaca;

  }
  .timepicker .picker .mm-wrapper {
    flex: 1 1 0;
    height: 134px;
    border-right: 1px solid #cacaca;
    border-left: 1px solid #e7e9eb;
    border-bottom: 1px solid #cacaca;
  }
  .timepicker .picker .hh-wrapper span,
  .timepicker .picker .mm-wrapper span
  {
    display: block;
    height: 11px;
    // padding: 5.5px 0 !important;
    color: #32353b;
    text-align: center;
    //18.1.26 스크롤바 영역만큼 왼쪽 -마진 적용.가운데 정렬 수정.
    margin-right:-12px;
    // line-height: 11px;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: normal;
    vertical-align: middle;
    width: 72px;
    text-align: center;
    // padding-right: 12px;
    // box-sizing: content-box;
    box-sizing: border-box;
  }
  .timepicker .picker .hh-wrapper span:hover,
  .timepicker .picker .mm-wrapper span:hover {
    background-color: #f2f4f7;
    cursor: pointer;
  }
  .timepicker .picker .hh-wrapper span.selected-time,
  .timepicker .picker .mm-wrapper span.selected-time {
    background-color: #f2f4f7;
  }
  .btn-wrapper {
    float: left;
    width:100%;
    border-top:1px solid #d8d8d8;
    padding:10px 20px;
    text-align: right;
    box-sizing: border-box;
  }
  .btn-wrapper > button {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    vertical-align: middle;
    text-align: center;
    min-width: 70px;
    color: #fff;
    background-color: #cbd0d5;
  }
</style>
