<template>
  <div :class="{'include_right_panel': true, 'right_panel_full': isFullScreenOpened}" v-show="_isRightPanelOpen">
    <div class="panel_section" v-show="_rightPanelType === 'pivot'">
      <!-- right_panel_layer :: Pivot Setting -->
      <pivot-setting
        :toggleRightPanel="toggleRightPanel"
        :pivotSettingData="pivotSettingData"
        :setPivotFilterList="setPivotFilterList"
        :saveLastReportSetting="saveLastReportSetting"
      >
      </pivot-setting>
    </div>
    <div class="panel_section" v-if="_rightPanelType === 'about_report'">
      <!-- right_panel_layer :: About this report -->
      <about-report
        :toggleRightPanel="toggleRightPanel">
      </about-report>
    </div>
    <div class="panel_section" v-if="_rightPanelType === 'about_chart'">
      <!-- right_panel_layer :: About this chart -->
      <about-chart
        :toggleRightPanel="toggleRightPanel">
      </about-chart>
    </div>
    <div class="right-panel-dimmed-layer" v-if="_isRightPanelOpen" @click="toggleRightPanel"></div>
  </div>
</template>
<script>
import * as types from '@/shared/stores/types'
import { mapState } from 'vuex'
import PivotSetting from '../common/PivotSetting'
import AboutChart from '../common/AboutChart'
import AboutReport from '../common/AboutReport'

export default {
  name: 'RightPivotPanel',
  components: {
    PivotSetting,
    AboutChart,
    AboutReport
  },
  props: {
    pivotSettingData: Object,
    setPivotFilterList: Function,
    saveLastReportSetting: Function
  },
  computed: {
    ...mapState({
      _isRightPanelOpen: state => state.report._isRightPanelOpen,
      _rightPanelType: state => state.report._rightPanelType,
      isFullScreenOpened: state => state.common.isFullScreenOpened
    })
  },
  methods: {
    toggleRightPanel () {
      this.$store.commit(types.TOGGLE_RIGHT_PANEL)
    }
  }
}
</script>
<style lang="scss">
  .include_right_panel .panel_section {
    z-index: 80;
  }
  .right-panel-dimmed-layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 70;
  }
  .right_panel_full {
    z-index: 1000;
    position: fixed;
    top: 54px;
  }
</style>

