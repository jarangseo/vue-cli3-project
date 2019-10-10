<template>
  <div class="chart_middle_info get_width_custom_progress" style="marginBottom: 5px;">
    <div style="display:flex;marginBottom:0px;">
      <span class="custom_progress_info_name">{{ name }}</span>
      <span style="flex:1;textAlign:right;color:#faa466;">{{ percent }} {{ unit }}</span>
    </div>
    <v-popover offset="0" trigger="hover" placement="top" width="100%" :container="'.content'" >
      <div class="dashboard_custom_progress_bar_background">
        <div class="dashboard_custom_progress_bar" :style="`background-color: ${color};width: ${percentage}%;`"/>
      </div>
      <template slot="popover" class="custom_tooltip">
        <div>
          <p style="fontWeight:bolder;marginBottom:5px;">{{ name }}</p>
          <!-- {{ percent }}% -->
          <p> {{ isSales ? mixinGetSignTxt() : ''}}{{ mixinNumberWithCommasToString(value) }}</p>
        </div>
      </template>
    </v-popover>
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import CommonProgressBar from '../common/CommonProgressBar'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'CustomProgressInfo',
    mixins: [ dashboardMixin ],
    props: {
      name: {
        type: String,
        required: true,
        default: ''
      },
      value: {
        type: String,
        required: true,
        default:0
      },
      unit: {
        type: String,
        required: true,
        default: ''
      },
      color: {
        type: String,
        required: true,
        default: ''
      },
      percent: {
        type: Number,
        required: true,
        default: 0
      },
      isSales: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    components: {
      CommonProgressBar
    },
    watch: {},
    data () { return {
      percentage: 0
    }},
    computed: {
    },
    created () {
    },
    mounted () {
      this.percentage = this.percent
    },
    methods: {
    }
  }
</script>
<style scoped>
.dashboard_custom_progress_bar_background {
  width: 100%;
  height: 6px;
  background-color: #fafafa;
  border-radius: 4px;
}
.dashboard_custom_progress_bar {
  position: relative;
  height: 6px;
  border-radius: 4px;
  transition: width 1s ease 0s;
}
.custom_progress_info_name {
  flex:1;
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #212121;
}
.custom_progress_info_value {
  flex:1;
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.23;
  letter-spacing: normal;
  color: #fbb757;
}

.tooltip.popover .popover-inner {
  background-color: #FFFFFFE6 !important;
  border:1px solid green !important;
  padding: 5px 8px !important;
  border-radius: 1px !important;
}
</style>
<style>
.get_width_custom_progress .trigger {
  width: 100%;
}
</style>
