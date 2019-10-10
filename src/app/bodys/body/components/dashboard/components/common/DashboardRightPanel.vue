<template>
  <div id="include_right_panel" class="include_right_panel" :class="{'close': !_aboutChart.isOpen}">
    <div class="panel_section">
      <!-- right_panel_layer :: About this chart -->
      <!-- [D] 사용되는 페이지를 제외한 구조는 코드삭제 필요 -->
      <div class="about_panel chart_section" style="display:block">
        <div class="about_info_title">
          <span>{{ getPanelName }}</span>
          <a class="close_info" @click="closeDashboardRightPanel()"><span class="blind">close</span></a>
        </div>
        <div class="about_info_area">
          <div class="info_detail">
              <dl>
                <dt style="word-break: break-all;">
                  {{ _aboutChart.data.chartName }}
                </dt>
                <dd> {{ _aboutChart.data.tooltip }} </dd>
                <dd v-html="_aboutChart.data.description"></dd>
                  <!-- <template v-for=" (item, index) in _aboutChart.data.dimension">
                    <dt :key="`about_chart_dimension_dt1_${index}`"> {{ item.name }} </dt>
                    <dt :key="`about_chart_dimension_dt2_${index}`"> Detailed Information </dt>
                  </template> -->

                  <dt style="margin-bottom: 8px;"> Used Analysis Item </dt>
                  <dd>
                      <div class="set_item" v-if="_aboutChart.data.kpi && _aboutChart.data.kpi.length > 0" >
                          <div class="set_item_name">
                            <span>KPI</span>
                          </div>
                          <div class="set_item_list">
                            <dl v-for=" (item, index) in _aboutChart.data.kpi" :key="`about_chart_kpi_${index}`">
                              <dt>{{ item.name }}</dt>
                              <dd v-if="item.tooltip" style="margin-bottom: 8px;">
                                {{ item.tooltip }}
                              </dd>
                            </dl>
                          </div>
                      </div>
                      <div class="set_item" v-if="_aboutChart.data.dimension && _aboutChart.data.dimension.length > 0">
                        <div class="set_item_name">
                          <span>Dimension</span>
                        </div>
                        <div class="set_item_list">
                          <dl v-for="(item, index) in _aboutChart.data.dimension" :key="`about_chart_dimension_${index}`">
                            <dt> {{ item.name }} </dt>
                            <dd v-if="item.tooltip" style="margin-bottom: 8px;">
                              {{ item.tooltip }}
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <!-- <div class="set_item ">
                          <div class="set_item_name">
                              <span>KPI</span>
                          </div>
                          <div class="set_item_list">
                              <dl>
                                  <dt>
                                      ARPPU 
                                  </dt>
                                  <dd>
                                      Average Revenue Per Active User.<br>
                                      The average purchase amount per user.<br>
                                      (= total sales revenue/number of users) 
                                  </dd>
                              </dl>
                          </div>
                      </div>
                      <div class="set_item ">
                          <div class="set_item_name">
                              <span>KPI</span>
                          </div>
                          <div class="set_item_list">
                              <dl>
                                  <dt>
                                      ARPPU 
                                  </dt>
                                  <dd>
                                      Average Revenue Per Active User.<br>
                                      The average purchase amount per user.<br>
                                      (= total sales revenue/number of users) 
                                  </dd>
                              </dl>
                          </div>
                      </div> -->
                  </dd>
              </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="right-panel-dimmed-layer" v-if="_aboutChart.isOpen" @click="toggleRightPanel"></div>
  </div> 
</template>

<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import HandlerDatePicker from '@/app/bodys/body/components/common/GrowthyDatepicker/HandlerDatePicker'
  import moment from "moment"
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'DashboardRightPanel',
    mixins: [ dashboardMixin ],
    components: {
      HandlerDatePicker
    },
    watch: {},
    data () {return {
    }},
    computed: {
      ...mapState({
        _aboutChart: state => state.dashboard._aboutChart,
      }),
      getPanelName () {
        return `About This ${_.lowerCase(this._aboutChart.type) === 'chart' ? 'Chart' : 'Report'  }`
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    methods: {
      ...mapMutations([
      ]),
      init () {
      },
      closeDashboardRightPanel () {
        this.mixinToggleAboutThisChart({ type: this._aboutChart.type, data: this._aboutChart.data })
      },
      toggleRightPanel () {
        this.mixinToggleAboutThisChart({ type: this._aboutChart.type, data: this._aboutChart.data })
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
