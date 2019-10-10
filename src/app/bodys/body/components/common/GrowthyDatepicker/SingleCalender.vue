<template>
  <div class="growthy-datepicker-calender">
    <div class="calender">
      <div class="calender-head">
        <span class="calender-prev-year-btn" @click="year--"></span>
        <span class="calender-prev-month-btn" @click="pm"></span>
        {{year}}{{local.yearSuffix}}.{{local.monthsHead[month]}}
        <span class="calender-next-month-btn" @click="nm"></span>
        <span class="calender-next-year-btn" @click="year++"></span>
      </div>
      <div class="calender-body">
        <div class="calender-days">
          <span class="calender-week" v-for="(i, key) in local.weeks" :key="key + '1'">{{i}}</span>
          <span
            class="calender-week"
            v-for="(date, key) in days"
            @click="setDate($event, date.y, date.m, date.i)"
            :class="[(date.p || date.n)?`calender-date-out` :'calender-date', status(date.y, date.m, date.i)]"
            :key="key + '2'"
          >
            {{date.i}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import VueScrollbar from 'vue2-scrollbar'

export default {
  name: 'SingleCalender',
  components: {
    VueScrollbar
  },
  watch: {
    alreadySelectedDates (dates) {
      let cDate = moment(dates[0])
      this.initData(cDate.year(), cDate.month(), cDate.format('YYYY-MM-DD'))
      this.$forceUpdate()
    }
  },
  props: {
    alreadySelectedDates: {
      type: Array
    },
    endType: {
      type: String,
      default: 'SD01'
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      year: '',
      month: '',
      selectedDate: '',
      hoverdDate: 0,
      maxEndDate: ''
    }
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
    days () {
      const days = []
      const year = this.year
      const month = this.month
      const time = moment([year, month, 1])
      const dow = this.local.dow || 7
      let lastDay
      let week
      let count

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
          m: month,
          n: moment(this.maxEndDate).isSameOrBefore(moment([year, month, i]))
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
    }
  },
  methods: {
    nm () {
      if (this.month < 11) {
        this.month++
      } else {
        this.month = 0
        this.year++
      }
    },
    pm () {
      if (this.month > 0) {
        this.month--
      } else {
        this.month = 11
        this.year--
      }
    },
    status (year, month, date) {
      const t = moment([year, month, date])
      let classList = []
      if (t.isSame(moment(this.selectedDate))) {
        classList.push('calender-date-selected')
      }
      return classList.toString()
    },
    setDate ($event, year, month, date) {
      const t = moment([year, month, date])
      if ($event.target.classList.contains('calender-date')) {
        this.selectedDate = t.format('YYYY-MM-DD')
        this.$parent.ok([this.selectedDate, this.selectedDate])
      }
      this.setUpdatedFlag(true)
    },
    initData (year, month, date) {
      this.selectedDate = date
      this.year = year
      this.month = month
    },
    setMaxEndDate () {
      this.maxEndDate = this.endType === 'SD01' ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.setMaxEndDate()
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
    overflow: hidden;
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
