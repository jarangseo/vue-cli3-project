<template>
<div class="calendar_area" :class="{'pivot-setting-area': parent === 'pivotSetting'}">
    <div class="month_calendar">
        <div class="year_month">
            <span class="year">{{year}}</span>.<span class="monfth">{{getMonth(month)}}</span>
        </div>
        <a @click="updateYear(0)" class="btn_go pre_year"><span class="blind">지난 해 (last year)</span></a>
        <a @click="updateYear(1)" class="btn_go next_year"><span class="blind">다음 해 (next year)</span></a>
        <table cellspacing="0" cellpadding="0" border="0" summary="" class="tbl_month_calender">
            <caption>년력</caption>
            <colgroup>
                <col>
            </colgroup>
            <thead>
                <tr class="blind">
                    <th scope="col" colspan="3"><span>month</span></th>
                </tr>
            </thead>
            <tbody class="month-picker-tbody">
                <tr>
                    <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                    <td>
                      <a @click="isDisableMonth(1) ? () => {} : updateMonth(year, 1)" :class="{'select': month === 1 && currentYear === year, 'disabled': isDisableMonth(1) }">
                        <span class="month">Jan</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(2) ? () => {} : updateMonth(year, 2)" :class="{'select': month === 2 && currentYear === year, 'disabled': isDisableMonth(2)}">
                        <span class="month">Feb</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(3) ? () => {} : updateMonth(year, 3)" :class="{'select': month === 3 && currentYear === year, 'disabled': isDisableMonth(3)}">
                        <span class="month">Mar</span>
                      </a>
                    </td>
                </tr>
                <tr>
                    <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                    <td>
                      <a @click="isDisableMonth(4) ? () => {} : updateMonth(year, 4)" :class="{'select': month === 4 && currentYear === year, 'disabled': isDisableMonth(4)}">
                        <span class="month">Apr</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(5) ? () => {} : updateMonth(year, 5)" :class="{'select': month === 5 && currentYear === year, 'disabled': isDisableMonth(5)}">
                        <span class="month">May</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(6) ? () => {} : updateMonth(year, 6)" :class="{'select': month === 6 && currentYear === year, 'disabled': isDisableMonth(6)}">
                        <span class="month">Jun</span>
                      </a>
                    </td>
                </tr>
                <tr>
                    <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                    <td>
                      <a @click="isDisableMonth(7) ? () => {} : updateMonth(year, 7)" :class="{'select': month === 7 && currentYear === year, 'disabled': isDisableMonth(7)}">
                        <span class="month">Jul</span>
                        </a></td>
                    <td>
                      <a @click="isDisableMonth(8) ? () => {} : updateMonth(year, 8)" :class="{'select': month === 8 && currentYear === year, 'disabled': isDisableMonth(8)}">
                        <span class="month">Aug</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(9) ? () => {} : updateMonth(year, 9)"  :class="{'select': month === 9 && currentYear === year, 'disabled': isDisableMonth(9)}">
                        <span class="month">Sep</span>
                      </a>
                    </td>
                </tr>
                <tr>
                    <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                    <td>
                      <a @click="isDisableMonth(10) ? () => {} : updateMonth(year, 10)" :class="{'select': month === 10 && currentYear === year, 'disabled': isDisableMonth(10)}">
                        <span class="month">Oct</span>
                      </a>
                    </td>
                    <td>
                      <a  @click="isDisableMonth(11) ? () => {} : updateMonth(year, 11)" :class="{'select': month === 11 && currentYear === year, 'disabled': isDisableMonth(11)}">
                        <span class="month">Nov</span>
                      </a>
                    </td>
                    <td>
                      <a @click="isDisableMonth(12) ? () => {} : updateMonth(year, 12)" :class="{'select': month === 12 && currentYear === year, 'disabled': isDisableMonth(12)}">
                        <span class="month">Dec</span>
                      </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GrowthyMonthPicker',
  props: {
    dates: Array,
    dateType: {
      type: String,
      default: 'start'
    },
    calType: {
      type: String,
      default: 'single'
    },
    parent: {
      type: String,
      default: 'dataHandler'
    },
    availableDates: {
      type: Array,
      default: () => {
        return []
      }
    },
    setUpdatedFlag: {
      type: Function,
      default: () => {}
    },
    isDashboard: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dates (dateArray) {
      this.setCalendarDate(dateArray)
    },
    availableDates (dates) {
      this.minAvailableMonth = this.dateType === 'start' ? moment(dates[0]).month() + 1 : moment(this.dates[0]).month() + 1
      this.minAvailableYear = this.dateType === 'start' ? moment(dates[0]).year() : moment(this.dates[0]).year()
      this.maxAvailableMonth = this.dateType === 'start' ? moment(this.dates[1]).month() + 1 : moment(dates[1]).month() + 1
      this.maxAvailableYear = this.dateType === 'start' ? moment(this.dates[1]).year() : moment(dates[1]).year()
    }
  },
  data () {
    return {
      month: moment().month(),
      year: moment().year(),
      currentMonth: moment().month() + 1,
      currentYear: moment().year(),
      minAvailableYear: moment().year(),
      minAvailableMonth: moment().month() + 1,
      maxAvailableYear: moment().year(),
      maxAvailableMonth: this.isDashboard ? moment().month() : moment().month() + 1
    }
  },
  computed: {
    moment () {
      return moment
    }
  },
  created () {
    // this.setCalendarDate(this.dates)
  },
  methods: {
    setCalendarDate (dateArray) {
      if (dateArray && dateArray[0]) {
        let date = this.dateType === 'start' ? moment(dateArray[0]) : moment(dateArray[1])
        this.month = date.month() + 1
        this.year = date.year()
        this.currentYear = this.year
      }
    },
    isDisableMonth (num) {
      let isBeforeMinStart = num < this.minAvailableMonth && this.minAvailableYear=== this.year || this.minAvailableYear > this.year
      let isAfterMaxEnd = num > this.maxAvailableMonth && this.maxAvailableYear === this.year || this.maxAvailableYear < this.year
      let isDisable = this.calType === 'single' ? isAfterMaxEnd : isBeforeMinStart || isAfterMaxEnd
      return isDisable
    },
    updateMonth (year, month) {
      this.month = month
      this.year = year
      this.currentYear = year
      this.$parent.monthOk(this.year, this.getMonth(this.month), this.dateType)
      this.setUpdatedFlag(true)
    },
    updateYear (type) {
      if (type === 0) {
        this.year = this.year - 1
      } else if (type === 1) {
        this.year = this.year + 1
      }
    },
    getMonth (date) {
      let month = date
      return month < 10 ? '0' + month : '' + month
    }
  }
}
</script>
<style lang="scss" scoped>
.month-picker-tbody {
  tr {
    td {
      a.disabled {
        color: #eee !important;
      }
    }
  }
}
.pivot-setting-area {
  .month_calendar {
    .pre_year {
      margin-left: -95px !important;
      line-height: 21px !important;
    }
    .next_year {
      margin-right: -40px !important;
      line-height: 21px !important;
    }
    .month-picker-tbody {
      tr {
        td {
          background-color: #fff !important;
          a {
            padding: 0 !important;
          }
        }
      }
    }
  }
}
</style>

