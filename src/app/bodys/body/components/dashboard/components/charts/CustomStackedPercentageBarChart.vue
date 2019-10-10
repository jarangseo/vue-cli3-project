<template>
  <div class="chart_middle_info" style="marginBottom: 10px;">
    <div style="marginLeft:10px;">
      <span class="custom_stacked_percentage_bar_chart_text" >{{ name }}</span>
    </div>
     <basic-highchart
      :height="height"
      :options="options"/>     
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import BasicHighchart from '../charts/BasicHighchart'
  export default {
    name: 'CustomStackedPercentageBarChart',
    props: {
      name: {
        type: String,
        required: true,
        default: ''
      },
      height: {
        type: String,
        required: true,
        default: '50px'
      },
      options: {
        type: Object,
        required: true,
        default: () => {
          return {}
        }
      }
    },
    components: {
      BasicHighchart
    },
    watch: {},
    data () {
      return {
    }},
    computed: {
    },
    created () {
      this.options.credits = { enabled: false }
      this.options.chart.backgroundColor = '#ffffff00'
    },
    mounted () {},
    methods: {
    }
  }
</script>
<style scoped>
.custom_stacked_percentage_bar_chart_text {
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  text-align:left;
}
</style>
