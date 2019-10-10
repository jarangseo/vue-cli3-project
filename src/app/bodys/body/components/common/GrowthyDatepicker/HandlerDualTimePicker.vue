<template>
<div class="set_layer_growthy start_end_time" style="display:block">
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
          <div class="set_time_area">
              <dl>
                  <dt>Time</dt>
                  <dd>
                      <input type="text" class="set_time" v-model="startTime" @click="toggleStartTimePicker" readonly="readonly" style="cursor:pointer;">
                      <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
                      <div class="drop_list_layer" style="width:186px;left:auto;right:0;z-index:1001;" v-if="isOpenStartTime">
                          <div class="inner_drop_list half_type" style="max-height:160px;">
                              <ul>
                                  <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                                  <li><span class="time_title">HH</span></li>
                                  <li v-for="(item, idx) in hours" :key="idx">
                                    <a :class="{'on': idx === firstHour}" @click="setFirstHour(idx)">{{ item }}</a>
                                  </li>
                              </ul>
                          </div>
                          <div class="inner_drop_list half_type" style="max-height:160px;">
                              <ul>
                                  <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                                  <li><span class="time_title">mm</span></li>
                                  <li v-for="(item, idx) in minutes" :key="idx">
                                    <a :class="{'on': idx === firstMinutes}"  @click="setFirstMinutes(idx)">{{ item }}</a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </dd>
              </dl>
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
          <div class="set_time_area">
              <dl>
                  <dt>Time</dt>
                  <dd>
                      <input type="text" class="set_time" @click="toggleEndTimePicker" v-model="endTime" readonly="readonly" style="cursor:pointer;">
                      <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
                      <div class="drop_list_layer" style="width:186px;left:auto;right:0;z-index:1001;" v-if="isOpenEndTime">
                          <div class="inner_drop_list half_type" style="max-height:160px;">
                              <ul>
                                  <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                                  <li><span class="time_title">HH</span></li>
                                  <li v-for="(item, idx) in hours" :key="idx">
                                    <a :class="{'on': idx === secondHour}"  @click="setSecondHour(idx)">{{ item }}</a>
                                  </li>
                              </ul>
                          </div>
                          <div class="inner_drop_list half_type" style="max-height:160px;">
                              <ul>
                                  <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                                  <li><span class="time_title">mm</span></li>
                                  <li v-for="(item, idx) in minutes" :key="idx">
                                    <a :class="{'on': idx === secondMinutes}"  @click="setSecondMinutes(idx)">{{ item }}</a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </dd>
              </dl>
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
        <span class="action_info" style="margin-right: 10px">* {{ maxString }}</span>
        <div class="action_btn">
            <a class="btn cancel" @click="innerToggleCalender">CANCEL</a>
            <a class="btn apply" @click="applyDate">APPLY</a>
        </div>
    </div>
</div>
</template>
<script>
import moment from 'moment'
import { util } from '@/shared/utils/util'

export default {
  name: 'HandlerDualTimePicker',
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
    from: {
      type: Number,
      default: 30
    },
    maxRange: {
      type: Number,
      default: 30
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    },
    isOpenCalendar: Boolean
  },
  watch: {
    alreadySetDate (dates) {
      this.initData()
    },
    isOpenCalendar (f) {
      if (!f) {
        this.isOpenStartTime = false
        this.isOpenEndTime = false
      }
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
    fdays () {
      const days = []
      const year = this.firstYear
      const month = this.firstMonth
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
      return util.replaceWords(this.$store.state.common._lang.dataBySelectedLang.analytics_handler_msg_maxdate, [{'{@max_period}': `${this.scope} Hours`}])
    }
  },
  data () {
    return {
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm'),
      endDate: moment().format('YYYY-MM-DD HH:mm'),
      firstMonth: moment().subtract(30, 'days').month(),
      firstYear: moment().subtract(30, 'days').year(),
      firstHour: moment().subtract(30, 'days').hour(),
      firstMinutes: moment().subtract(30, 'days').minute(),
      firstDate: moment().subtract(30, 'days').date(),
      secondMonth: moment().month(),
      secondYear: moment().year(),
      secondHour: moment().hour(),
      secondMinutes: moment().minute(),
      secondDate: moment().date(),
      today: moment().format('YYYY-MM-DD HH:mm'),
      todayMonth: moment().month(),
      todayYear: moment().year(),
      isOpenStartTime: false,
      isOpenEndTime: false,
      startTime: '',
      endTime: '',
      minutes: [],
      hours: [],
      selectedEndHoursIdx: -1,
      selectedEndMinutesIdx: -1,
      selectedStartHoursIdx: -1,
      selectedStartMinutesIdx: -1
    }
  },
  methods: {
    toggleEndTimePicker () {
      if (this.isOpenStartTime) {
        this.isOpenStartTime = false
      }
      this.isOpenEndTime = !this.isOpenEndTime
    },
    toggleStartTimePicker () {
      if (this.isOpenEndTime) {
        this.isOpenEndTime = false
      }
      this.isOpenStartTime = !this.isOpenStartTime
    },
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
      const endDate = moment(moment(this.endDate).format('YYYY-MM-DD HH:mm'))
      const startDate = moment(moment(this.startDate).format('YYYY-MM-DD HH:mm'))
      let classList = []
      if (t.isBefore(endDate)) {
        classList.push('calender-date')
      }

      if (t.isSame(moment(startDate.format('YYYY-MM-DD')))) {
        classList = []
        classList.push('calender-date-selected')
      }
      return classList.toString()
    },
    sstatus (year, month, date) {
      const t = moment([year, month, date])
      const startDate = moment(moment(this.startDate).subtract(1, 'days').format('YYYY-MM-DD HH:mm'))
      const endDate = moment(moment(this.endDate).format('YYYY-MM-DD HH:mm'))
      let classList = []
      if (t.isBetween(startDate, this.today, null, '[]')) {
        classList.push('calender-date')
      }

      if (t.isSame(moment(endDate.format('YYYY-MM-DD')))) {
        classList = []
        classList.push('calender-date-selected')
      }
      return classList.toString()
    },
    setStartDate ($event, year, month, date) {
      const t = moment([year, month, date, this.firstHour, this.firstMinutes])
      // [OGPQA-1061] 날짜 선택 이슈 수정을 위한 주석처리
      // this.firstYear = year
      // this.firstMonth = month
      // this.firstDate = date
      if ($event.target.classList.contains('calender-date')) {
        this.startDate = t.format('YYYY-MM-DD HH:mm')
      }
    },
    setEndDate ($event, year, month, date) {
      const t = moment([year, month, date, this.secondHour, this.secondMinutes])
      // [OGPQA-1061] 날짜 선택 이슈 수정을 위한 주석처리
      // this.secondYear = year
      // this.secondMonth = month
      // this.secondDate = date
      if ($event.target.classList.contains('calender-date')) {
        this.endDate = t.format('YYYY-MM-DD HH:mm')
      }
    },
    setFirstHour (hour) {
      let nextHour = hour
      let startDate = moment(this.startDate)
      let year = startDate.year()
      let month = startDate.month()
      let date = startDate.date()
      let endDate = moment(this.endDate)
      let nextDate = moment([year, month, date, nextHour, this.firstMinutes])
      if (!nextDate.isBefore(endDate)) {
        util.toastr().error('endDate 이후 날짜를 설정 할 수 없습니다.')
        return
      }
      this.firstHour = nextHour
      this.startDate = nextDate.format('YYYY-MM-DD HH:mm')
      this.startTime = `${((this.firstHour + '').length === 1 ? '0' + this.firstHour : this.firstHour) + ':' + ((this.firstMinutes + '').length === 1 ? '0' + this.firstMinutes : this.firstMinutes)}`
    },
    setFirstMinutes (minutes) {
      let nextMinutes = minutes
      let startDate = moment(this.startDate)
      let year = startDate.year()
      let month = startDate.month()
      let date = startDate.date()
      let endDate = moment(this.endDate)
      let nextDate = moment([year, month, date, this.firstHour, nextMinutes])
      if (!nextDate.isBefore(endDate)) {
        util.toastr().error('endDate 이후 날짜를 설정 할 수 없습니다.')
        return
      }
      this.firstMinutes = nextMinutes
      this.startDate = nextDate.format('YYYY-MM-DD HH:mm')
      this.startTime = `${((this.firstHour + '').length === 1 ? '0' + this.firstHour : this.firstHour) + ':' + ((this.firstMinutes + '').length === 1 ? '0' + this.firstMinutes : this.firstMinutes)}`
    },
    setSecondHour (hour) {
      let nextHour = hour
      let startDate = moment(this.startDate)
      let year = endDate.year()
      let month = endDate.month()
      let date = endDate.date()
      let endDate = moment(this.endDate)
      let nextDate = moment([year, month, date, nextHour, this.secondMinutes])
      if (!nextDate.isAfter(startDate)) {
        util.toastr().error('startDate 보다 이전 날짜를 설정 할 수 없습니다.')
        return
      }
      this.secondHour = hour
      this.endDate = nextDate.format('YYYY-MM-DD HH:mm')
      this.endTime = `${((this.secondHour + '').length === 1 ? '0' + this.secondHour : this.secondHour) + ':' + ((this.secondMinutes + '').length === 1 ? '0' + this.secondMinutes : this.secondMinutes)}`
    },
    setSecondMinutes (minutes) {
      let nextMinutes = minutes
      let startDate = moment(this.startDate)
      let year = endDate.year()
      let month = endDate.month()
      let date = endDate.date()
      let endDate = moment(this.endDate)
      let nextDate = moment([year, month, date, this.secondHour, nextMinutes])
      if (!nextDate.isAfter(startDate)) {
        util.toastr().error('startDate 보다 이전 날짜를 설정 할 수 없습니다.')
        return
      }
      this.secondMinutes = minutes
      this.endDate = nextDate.format('YYYY-MM-DD HH:mm')
      this.endTime = `${((this.secondHour + '').length === 1 ? '0' + this.secondHour : this.secondHour) + ':' + ((this.secondMinutes + '').length === 1 ? '0' + this.secondMinutes : this.secondMinutes)}`
    },
    initData () {
      let startDateMoment
      let endDateMoment
      this.hours = []
      this.minutes = []
      if (this.alreadySetDate && this.alreadySetDate.length === 2) {
        this.startDate = this.alreadySetDate[0]
        this.endDate = this.alreadySetDate[1]
      } else {
        this.startDate = moment().subtract(this.from, 'hours').format('YYYY-MM-DD HH:mm')
        this.endDate = moment().format('YYYY-MM-DD HH:mm')
      }
      startDateMoment = moment(this.startDate)
      endDateMoment = moment(this.endDate)
      this.firstYear = startDateMoment.year()
      this.firstMonth = startDateMoment.month()
      this.firstHour = startDateMoment.hour()
      this.firstMinutes = startDateMoment.minute()
      this.firstDate = startDateMoment.date()
      this.secondYear = endDateMoment.year()
      this.secondMonth = endDateMoment.month()
      this.secondHour = endDateMoment.hour()
      this.secondMinutes = endDateMoment.minute()
      this.secondDate = endDateMoment.date()
      this.startTime = `${((this.firstHour + '').length === 1 ? '0' + this.firstHour : this.firstHour) + ':' + ((this.firstMinutes + '').length === 1 ? '0' + this.firstMinutes : this.firstMinutes)}`
      this.endTime = `${((this.secondHour + '').length === 1 ? '0' + this.secondHour : this.secondHour) + ':' + ((this.secondMinutes + '').length === 1 ? '0' + this.secondMinutes : this.secondMinutes)}`
      for (let i = 0; i < 24; i++) {
        this.hours.push((i + '').length === 1 ? '0' + i : i + '')
      }
      for (let j = 0; j < 60; j++) {
        this.minutes.push((j + '').length === 1 ? '0' + j : j + '')
      }
    },
    applyDate () {
      let dates = []
      let st = moment(this.startDate)
      let et = moment(this.endDate)
      if (util.isBeforeMaxRange('hours', this.maxRange, [st, et])) {
        return util.toastr().error('최대 설정 가능한 범위를 벗어났습니다.')
      }
      this.setUpdatedFlag(true)
      dates.push(this.startDate)
      dates.push(this.endDate)
      this.$parent.ok(dates, 'dual')
    },
    closeTimePicker () {
      if (this.isOpenStartTime) {
        this.isOpenStartTime = false
      }
      if (this.isOpenEndTime) {
        this.isOpenEndTime = false
      }
    }
  },
  mounted () {
    // test123111
    this.initData()
  }
}
</script>
<style lang="scss" scoped>
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
