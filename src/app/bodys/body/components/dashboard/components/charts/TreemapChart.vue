<template>
  <!-- [D] 실제 chart 가 적용되는 영역(img tag 삭제 후 적용 부탁드립니다.) -->
  <highcharts v-if="options.series[0].data" :options="options" :style="`width:100%;height:${height};`"></highcharts>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import Highcharts from 'highcharts'
  import treemapInit from 'highcharts/modules/treemap'

  export default {
    name: 'TreemapChart',
    props: {
      options: {
        type: Object,
        required: false,
        default: () => {
          return {}
        }
      },
      height: {
        type: String,
        required: false,
        default: '280px'
      }
    },
    components: {},
    watch: {},
    data () {return {
    }},
    computed: {},
    created () {
      treemapInit(Highcharts)
      this.options.credits = { enabled: false }
    },
    mounted () {},
    methods: {}
  }
</script>
