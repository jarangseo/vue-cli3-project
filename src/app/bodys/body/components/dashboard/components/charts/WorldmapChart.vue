<template>
  <highcharts :constructor-type="'mapChart'" :options="options" class="map" :style="`width:100%;height:${height};`"></highcharts>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import Highcharts from 'highcharts'
  import mapInit from 'highcharts/modules/map'
  import {worldmap} from '@/shared/utils/worldmap'

  export default {
    name: 'WorldmapChart',
    props: {
      options: {
        type: Object,
        required: true,
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
      this.options.credits = { enabled: false }
      // mapInit(Highcharts)
      // Highcharts.maps['Country'] = worldmap
    },
    mounted () {
    },
    methods: {
      getNationCodeCsv () {
        let worldcsv = 'id,continent,name\n'
        worldmap.features.forEach( item => {
          worldcsv += `${item.id},${item.properties.continent},${item.properties.name}\n`
        })
        console.log('worldmap csv: ', worldcsv)
      }
    }
  }
</script>
