<template>
  <div class="chart_realtime">
    <div class="chart_realtime_sub">
      <div class="chart_realtime_sub_line" :class="`${parent}_gray_line`"/>
      <div class="chart_realtime_sub_line_green" :class="`${parent}_green_line`"/>
      <template v-for="(item, index) in rangeHasPointTrueData">
        <div
          v-if="item.type !== 'now'"
          :key="`A-${index}`"
          :class="`${parent} chart_realtime_sub_point before${item.value}${item.type}`"
          @click="changeRange(item.type, item.value)"
          v-tooltip.top-center="getTooltipMessage(item)" />
          <!-- "`${item.tooltip}`" -->
        <div
          v-else
          :key="`A-${index}`"
          class="chart_realtime_last_item_arrow"
          :class="`${parent} now`"
          @click="changeRange(item.type, item.value)"
          v-tooltip.top-center="getTooltipMessage(item)" />
      </template>

      <template v-for="(item, index) in rangeData">
        <div
          v-if="item.type !== 'now'"
          :key="`B-${index}`"
          :class="`chart_realtime_sub_guide_line_point before${item.value}${item.type}`" />
        <div
          v-else
          :key="`B-${index}`"
          class="chart_realtime_sub_guide_line_point now" />
      </template>

      <template v-for="(item, index) in rangeHasPointTrueData">
        <div
          v-if="index === 0"
          :key="`C-${index}`"
          :class="`chart_realtime_sub_tag sub_tag_default tag_first before${item.value}${item.type}`"
          @click="changeRange(item.type, item.value)"> {{item.value}}{{item.type}} </div>
        <div
          v-else-if="item.type == 'now'"
          :key="`C-${index}`"
          :class="`chart_realtime_sub_tag sub_tag_now tag_now now`"
          @click="changeRange(item.type, item.value)"> {{ nowTime }} </div>
        <div
          v-else
          :key="`C-${index}`"
          :class="`chart_realtime_sub_tag sub_tag_default tag_normal before${item.value}${item.type}`"
          @click="changeRange(item.type, item.value)"> {{item.value}}{{item.type}} </div>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { isNumber, isString } from 'highcharts'
// import '@static/css/vtooltip.css'
// import '@static/css/realtimeChart.css'
// import rangeData from '@static/js/realtimeChartData.json'

export default {
  name: 'TimeLineSelector',
  props: {
    newDate: {
      type: String,
      required: false,
      default: new Date()
    },
    initTimeType: {
      type: String,
      required: false,
      default: 'h'
    },
    initTimeValue: {
      type: Number,
      required: false,
      default: 2
    },
    parent: {
      type: String,
      required: false,
      default: (_.random(0, 100) + (_.random(0, 50) * _.random(0, 3))).toString()
    }
  },
  watch: {
    returnData (data) {
      this.$emit('changeTimeLineRange', data)
    }
  },
  data () {
    return {
      pointColor: { default: '#dbdbdb', green: '#6fc765' },
      isGreenPointStart: false,
      defaultClass: 'before2h',
      // newDate: new Date(),
      nowTime: moment(this.newDate).format('HH:mm'),
      rangeData: [
        {type: 'D', value: 14, hasPoint: true},
        {type: 'D', value: 13, hasPoint: false},
        {type: 'D', value: 12, hasPoint: true},
        {type: 'D', value: 11, hasPoint: false},
        {type: 'D', value: 10, hasPoint: true},
        {type: 'D', value: 9, hasPoint: false},
        {type: 'D', value: 8, hasPoint: true},
        {type: 'D', value: 7, hasPoint: false},
        {type: 'D', value: 6, hasPoint: true},
        {type: 'D', value: 5, hasPoint: false},
        {type: 'D', value: 4, hasPoint: true},
        {type: 'D', value: 3, hasPoint: false},
        {type: 'D', value: 2, hasPoint: true},
        {type: 'h', value: 24, hasPoint: true},
        {type: 'h', value: 12, hasPoint: true},
        {type: 'h', value: 2, hasPoint: true},
        {type: 'now', value: 0, hasPoint: true}
      ],
      returnData: {type: '', value: 0}
    }
  },
  computed: {
    rangeHasPointTrueData () {
      return this.rangeData.filter((item) => {
        return item.hasPoint
      })
    }
  },
  created () {
    this.setTooltipMessage()
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.changeRange(this.initTimeType, this.initTimeValue)
    },
    changeRange (rangeType, rangeValue) {
      // console.log('rangeType: ', rangeType, " / rangeValue: ", rangeValue)
      if (!rangeType || !isString(rangeType) || !isNumber(rangeValue)) {
        console.log('[log] changeRange() 파라미터가 존재 하지 않거나 형식에 맞지 않습니다. > ', `rangeType: ${rangeType}, rangeValue:${rangeValue}`)
        this.changeStyle(this.defaultClass)
        return
      }

      let objClassName = (rangeType === 'now') ? 'now' : `before${rangeValue}${rangeType}`

      if (!document.getElementsByClassName(objClassName)[0]) {
        console.log(`[log] class='${objClassName}'가 존재하지 않습니다.`)
        objClassName = this.defaultClass
      }
      this.returnData = {type: rangeType, value: rangeValue}
      this.changeStyle(objClassName)
    },
    changeStyle (objClassName) {
      this.isGreenPointStart = false
      this.changePointStyle(objClassName)
      this.changeLineStyle(objClassName)
    },
    changePointStyle (objClassName) {
      const points = Array.from(document.getElementsByClassName(this.parent))
      let greenPointCount = 0
      points.filter(item => _.includes(item.classList, this.parent)).forEach((item, index) => {
        if (item.classList.contains('choosed_point')) item.classList.remove('choosed_point')
        if (Array.from(item.classList).includes('now')) {
          item.classList.add('chart_realtime_last_item_arrow')
          item.classList.remove('chart_realtime_sub_point')
        } else {
          if (!this.isGreenPointStart) this.isGreenPointStart = !!item.classList.contains(objClassName)
          // if (!this.isGreenPointStart) item.style.backgroundColor = this.pointColor.default
          item.style.backgroundColor = (this.isGreenPointStart) ? (greenPointCount === 0 ? '#ffffff' :  this.pointColor.green) : this.pointColor.default
          if (this.isGreenPointStart) greenPointCount++
        }

      })
      if (objClassName === 'now') {
        const nowPoints = Array.from(document.getElementsByClassName('chart_realtime_last_item_arrow'))
        nowPoints.filter(item => _.includes(item.classList, this.parent))
          .forEach((item, index) => {
          item.classList.remove('chart_realtime_last_item_arrow')
          item.classList.add('chart_realtime_sub_point')
        })
      }
    },
    changeLineStyle (objClassName) {
      const obj = Array.from(document.getElementsByClassName(objClassName)).filter( item => _.includes(item.classList, this.parent))[0]
      const grayLineObj = Array.from(document.getElementsByClassName('chart_realtime_sub_line')).filter( item => {
        return _.includes(item.classList, (`${this.parent}_gray_line`))
      })
      const greenLineObj =  Array.from(document.getElementsByClassName('chart_realtime_sub_line_green')).filter( item => {
        return _.includes(item.classList, (`${this.parent}_green_line`))
      })
      const pointObjLeft = Number(window.getComputedStyle(obj).left.replace('px', ''))
      const fullLeftSize = Number(window.getComputedStyle(grayLineObj[0]).width.replace('px', ''))

      greenLineObj[0].style.width = (fullLeftSize - pointObjLeft) + 'px'
      obj.classList.add('choosed_point')
    },
    setTooltipMessage () {
      if (!this.rangeData || !this.rangeHasPointTrueData) {
        console.log('[log] 툴팁을 표시할 범위 데이터가 존재 하지 않습니다. > \n', 'rangeData: ', this.rangeData, '\n rangeHasPointTrueData: ', this.rangeHasPointTrueData)
        return
      }
      this.rangeHasPointTrueData.forEach((item) => {
        if (!item.type || !isString(item.type) || !isNumber(item.value)) {
          console.log('[log] beforeTime() 파라미터가 존재 하지 않거나 형식에 맞지 않습니다. > ', `timeType: ${item.type}, timeValue:${item.value}`)
          return ''
        }
        const timeTypeToLowerCase = item.type.toLowerCase()
        switch (timeTypeToLowerCase) {
          case 'd':
            item.tooltip = moment(this.newDate).add(item.value * -1, timeTypeToLowerCase).format('YYYY.MM.DD ') + this.nowTime + ' ~'
            break
          case 'h':
            item.tooltip = moment(this.newDate).add(item.value * -1, timeTypeToLowerCase).format('YYYY.MM.DD HH:mm') + ' ~'
            break
          case 'now':
            item.tooltip = moment(this.newDate).format('YYYY.MM.DD ') + this.nowTime
            break
          default: break
        }
      })
    },
    getTooltipMessage (item) {
      if (!item.type || !isString(item.type) || !isNumber(item.value)) {
        console.log('[log] beforeTime() 파라미터가 존재 하지 않거나 형식에 맞지 않습니다. > ', `timeType: ${item.type}, timeValue:${item.value}`)
        return ''
      }
      const timeTypeToLowerCase = item.type.toLowerCase()
      switch (timeTypeToLowerCase) {
        case 'd': return moment(this.newDate).add(item.value * -1, timeTypeToLowerCase).format('YYYY.MM.DD ') + this.nowTime + ' ~'
        case 'h': return moment(this.newDate).add(item.value * -1, timeTypeToLowerCase).format('YYYY.MM.DD HH:mm') + ' ~'
        case 'now': return moment(this.newDate).format('YYYY.MM.DD ') + this.nowTime
        default: return ''
      }
    }
  }
}
</script>

<style scoped>
.chart_realtime{
  width:100%;
  /* height: 200px; */
}
.chart_realtime_sub {
  position: relative;
  /* height: 200px; */
}

.chart_realtime_sub_line {
  position: absolute;
  margin-top:23px;
  width: 100%;
  height: 4px;
  border-radius: 6px;
  background-color: #dbdbdb;
}

.chart_realtime_sub_line_green {
  position: absolute;
  margin-top:23px;
  width: 47%;
  right: 0%;
  height: 4px;
  border-radius: 6px;
  background-color: #6fc765;
}

.chart_realtime_sub_point {
  position: absolute;
  cursor: pointer;
  margin-top:18px;
  width: 14px;
  height: 14px;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  background-color: #6fc765;
}

.chart_realtime_sub_point:active {
  position: absolute;
  margin-top:15px;
  margin-left:-3px  !important;
  width: 19px;
  height: 19px;
  /* border-radius: 12px; */
  border-radius: 50%;
  box-shadow: 1px 2px 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #00a000;
  border: 3px solid #ffffff;
}

.choosed_point {
  margin-top:15px;
  margin-left:-3px;
  border-radius: 50%;
  width: 19px;
  height: 19px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: 3px solid #00a000;
  /* border: 6px solid #ffffff; */
}

.chart_realtime_sub_guide_line_point {
  position: absolute;
  margin-top:38px;
  margin-left:7px;
  width: 1px;
  height: 6px;
  background-color: #dbdbdb;
}
.chart_realtime_sub_tag {
  position: absolute;
  cursor: pointer;
  margin-top:48px;
  border-radius: 4px;
  text-align: center;
  line-height: 24px;
  font-size: 12px;

}
.sub_tag_default {
  width: 38px;
  height: 24px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
}
.sub_tag_now {
  width: 42px;
  height: 24px;
  background-color: rgba(226, 241, 255, 0.5);
}
.tag_first {
  margin-left:-10px;
}
.tag_normal {
  margin-left:-13px;
}
.tag_now {
  margin-left:-13px;
}

.before14D {left:0px;}
.before13D {left:6.5%;}
.before12D {left:13%;}
.before11D {left:19.5%;}
.before10D {left:26%;}
.before9D {left:32.5%;}
.before8D {left:39%;}
.before7D {left:45.5%;}
.before6D {left:52%;}
.before5D {left:58.5%;}
.before4D {left:65%;}
.before3D {left:71.5%;}
.before2D {left:78%;}
.before24h {left:83.5%;}
.before12h {left:89%;}
.before2h {left:94.5%;}
.now {left:100%;}

.chart_realtime_sub_tag .before14D {margin-left:0px !important;}
.chart_realtime_last_item_arrow {
  position: absolute;
  cursor: pointer;
  margin-top:18px;
  width: 14px;
  height: 14px;
  background-color: #6fc765;
  content: '';
  display: block;
  position: absolute;
  right: -6px;
  border-top: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #00a000;
  background: #fff;
  z-index: 20;
}
</style>
