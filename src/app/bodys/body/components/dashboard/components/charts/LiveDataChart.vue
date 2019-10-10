<template>
  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
  <highcharts :options="options" :style="`width:${width};height:${height};`"></highcharts>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import Highcharts from 'highcharts'
  import liveDataInit from 'highcharts/modules/data'

  export default {
    name: 'LiveDataChart',
    props: {
      options: {
        type: Object,
        required: false,
        default: () => {
          return {}
        }
      },
      width: {
        type: String,
        required: false,
        default: '100%'
      },
      height: {
        type: String,
        required: false,
        default: '240px'
      }
    },
    components: {},
    watch: {},
    data () {return {}},
    computed: {},
    created () {
      liveDataInit(Highcharts)
      this.options.credits = { enabled: false }
    },
    mounted () {},
    methods: {}
  }
</script>
<style>
.chartSize {
  position: relative;
  width:100%;
  height:100%;
}
</style>
