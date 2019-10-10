<template>
  <div class="about_panel chart_section">
    <div class="about_info_title">
      <span>About This Chart</span>
      <a href="#" @click.stop.prevent="toggleRightPanel()" class="close_info"><span class="blind">close</span></a>
    </div>
    <div class="about_info_area">
      <div class="info_detail">
        <dl>
          <dt style="word-break: break-all;">
            {{ _aboutChartInfo.name }}
          </dt>
          <dd>
            {{ _aboutChartInfo.chartGlossary ? _aboutChartInfo.chartGlossary.tooltip : '' }}
          </dd>
          <template v-if="_aboutChartInfo.chartGlossary && _aboutChartInfo.chartGlossary.description">
            <dt>
              Detailed Information
            </dt>
            <dd class="ql-editor" v-html="_aboutChartInfo.chartGlossary.description">
              <!--Daily Data of main KPIs Such as users downloads, sales Daily Data of main KPIs Such as users downloads, sales
              <img src="~@/assets/img/@img_right_panel.png" width="270" height="220" alt="image" />-->
            </dd>
          </template>
          <template v-if="_aboutChartInfo.kpiGlossaryList.length > 0 || _aboutChartInfo.dimensionGlossaryList.length > 0">
            <dt>
              Used Analysis Item
            </dt>
            <dd>
              <div class="set_item" v-if="_aboutChartInfo.kpiGlossaryList.length > 0">
                <div class="set_item_name">
                  <span>KPI</span>
                </div>
                <div class="set_item_list">
                  <dl v-for="(item, index) in _aboutChartInfo.kpiGlossaryList" :key="index">
                    <dt>
                      {{ item.tagName }}
                    </dt>
                    <dd v-if="item.glossary" style="margin-bottom: 8px;">
                      {{ item.glossary ? item.glossary.tooltip : '' }}
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="set_item" v-if="_aboutChartInfo.dimensionGlossaryList.length > 0">
                <div class="set_item_name">
                  <span>Dimension</span>
                </div>
                <div class="set_item_list">
                  <dl v-for="(item, index) in _aboutChartInfo.dimensionGlossaryList" :key="index">
                    <dt>
                      {{ item.tagName }}
                    </dt>
                    <dd v-if="item.glossary" style="margin-bottom: 8px;">
                      {{ item.glossary ? item.glossary.tooltip : '' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </dd>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
import * as types from '@/shared/stores/types'
import { mapState } from 'vuex'
import _ from 'lodash'
import { common } from '@/shared/utils/common'

export default {
  name: 'AboutChart',
  props: {
    toggleRightPanel: Function
  },
  computed: {
    ...mapState({
      _aboutChartInfo: state => state.report._aboutChartInfo,
      _objectId: state => state.report._objectId,
      _isLeft: state => state.report._isLeft
    }),
    _ () {
      return _
    },
    common () {
      return common
    }
  },
  methods: {
    getAboutChart () {
      this.$store.dispatch(types.GET_ABOUT_THIS_CHART, { objectId: this._objectId, isLeft: this._isLeft, projectId: window.localStorage.setProjectId })
    }
  },
  created () {
    this.$store.commit(types.INIT_ABOUT_THIS_CHART)
    this.getAboutChart()
  }
}
</script>
<style lang="scss">
  .about_panel .about_info_area .info_detail img, .about_panel .about_info_area .info_detail iframe {
    width: 270px;
  }
  .ql-editor a {
    text-decoration: underline;
    color: #06c;
  }
  .ql-editor em {
    font-style: italic;
  }
  .ql-editor strong, .ql-editor b {
    font-weight: bold;
  }
</style>
