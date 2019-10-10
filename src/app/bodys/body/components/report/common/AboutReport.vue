<template>
  <div class="about_panel report_section">
    <div class="about_info_title">
      <span>About This Report</span>
      <a href="#" @click.stop.prevent="toggleRightPanel()" class="close_info"><span class="blind">close</span></a>
    </div>
    <div class="about_info_area">
      <div class="info_detail">
        <dl>
          <dt style="word-break: break-all;">
            {{ _aboutReportInfo.name }}
          </dt>
          <dd>
            {{ _aboutReportInfo.reportGlossary ? _aboutReportInfo.reportGlossary.tooltip : '' }}
          </dd>
          <!-- [OGPQA-1267] 사양변경으로 삭제 -->
          <!-- <dt v-if="_aboutReportInfo.mapLogList.length > 0">
            Related GROWTHY Map Data Design
          </dt> -->
          <!-- <dd>
            <ul>
              <li v-for="(item, index) in _aboutReportInfo.mapLogList" :key="index">
                <a @click="goToGrowthyMap(item.projectId, item.dataDesignId, item.deployedVersion, item.type)" class="btn_go"><span>{{ item.type }} &gt; {{ item.logDesignName }}</span></a>
              </li>
            </ul>
          </dd> -->
          <template v-if="_aboutReportInfo.reportGlossary && _aboutReportInfo.reportGlossary.description">
            <dt>
              Detailed Information
            </dt>
            <dd class="ql-editor" v-html="_aboutReportInfo.reportGlossary.description">
              <!--Daily Data of main KPIs Such as users downloads, sales Daily Data of main KPIs Such as users downloads, sales
              <img src="~@/assets/img/@img_right_panel.png" width="270" height="220" alt="image" />-->
            </dd>
          </template>
          <template v-if="_aboutReportInfo.kpiGlossaryList.length > 0 || _aboutReportInfo.dimensionGlossaryList.length > 0">
            <dt>
              Used Analysis Item
            </dt>
            <dd>
              <div class="set_item" v-if="_aboutReportInfo.kpiGlossaryList.length > 0">
                <div class="set_item_name">
                  <span>KPI</span>
                </div>
                <div class="set_item_list">
                  <dl v-for="(item, index) in _aboutReportInfo.kpiGlossaryList" :key="index">
                    <dt>
                      {{ item.tagName }}
                    </dt>
                    <dd v-if="item.glossary" style="margin-bottom: 8px;">
                      {{ item.glossary ? item.glossary.tooltip : '' }}
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="set_item" v-if="_aboutReportInfo.dimensionGlossaryList.length > 0">
                <div class="set_item_name">
                  <span>Dimension</span>
                </div>
                <div class="set_item_list">
                  <dl v-for="(item, index) in _aboutReportInfo.dimensionGlossaryList" :key="index">
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
  name: 'AboutReport',
  props: {
    toggleRightPanel: Function
  },
  computed: {
    ...mapState({
      _aboutReportInfo: state => state.report._aboutReportInfo,
      _menuId: state => state.report._menuId,
      _depth: state => state.report._depth
    }),
    _ () {
      return _
    },
    common () {
      return common
    }
  },
  methods: {
    getAboutReport () {
      this.$store.dispatch(types.GET_ABOUT_THIS_REPORT, { menuId: this._menuId, depth: this._depth, projectId: window.localStorage.setProjectId, thisComponent: this })
    },
    permissionError () {
      this.$router.push({ name: 'NoPermission' })
    },
    goToGrowthyMap (projectId, dataDesignId, version, dataDesignType) {
      const path = window.location.origin
      if (path.indexOf('analytics-beta') > -1) {
        window.open('http://map-beta.growthy.game.line-alpha.me' + `/datadesign/view/${projectId}/${dataDesignId}?version=${version}&type=${dataDesignType}`, '_blank')
      } else if (path.indexOf('alpha') > -1) {
        window.open('http://map.growthy.game.line-alpha.me' + `/datadesign/view/${projectId}/${dataDesignId}?version=${version}&type=${dataDesignType}`, '_blank')
      } else {
        window.open('https://map.growthy.game.line.me' + `/datadesign/view/${projectId}/${dataDesignId}?version=${version}&type=${dataDesignType}`, '_blank')
      }
    }
  },
  created () {
    this.$store.commit(types.INIT_ABOUT_THIS_REPORT)
    this.getAboutReport()
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
