<template>
  <div id="wrap">
    <app-header></app-header>
    <section>
      <div class="container">
        <!-- [D] 높이값(height)을 inline으로 적용 필요(resize 대응필요) -->
        <!-- [D] 배너 높이 (40px) 와 header 높이(64px) 상태에 따른 계산 후 적용 필요 -->
        <div class="inner_container" style="height: calc(100vh - 64px);">
          <nav-menu></nav-menu>
          <!-- [D] LNB가 없는 Error 페이지는 content에 error 클래스 추가 필요  -->
          <div class="content error">
            <div class="inner_content">
              <div class="content_section">
                <div class="inner_content_section">
                  <div class="error_message_section">
                    <!-- error message -->
                    <!-- [D] inner_error_message에 위치값 수정을 위한 클래스 적용 필요 -->
                    <!--
                        No Project => no_project
                        No Permission => no_permisson
                        No Page => no_page
                        No_Service_category => no_s_category
                        Not deployed Log => not_d_log
                    -->
                    <div class="inner_error_message no_s_category">
                      <span class="message">Set Service Category</span>
                      <p>{{dataBySelectedLang.analytics_error_msg_nocategory}}</p>

                      <span class="more_info">{{dataBySelectedLang.analytics_error_msg_deploylogauth}}</span>
                      <a href="#" @click.stop.prevent="goToGrowthyMap" class="btn_go_map"><span>Go to GROWTHY Map</span></a>
                    </div>
                  </div>
                </div>
              </div>
              <!-- footer -->
              <footer-panel></footer-panel>
              <!-- //footer -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Header from '../layout/Header.vue'
import FooterPanel from '../layout/FooterPanel.vue'
import NavMenu from '../layout/NavMenu'
import { mapState } from 'vuex'

export default {
  name: 'NoServiceCategory',
  components: {
    AppHeader: Header,
    FooterPanel,
    NavMenu
  },
  watch: {
    _resizeWindow () {
      this.handleResize()
    }
  },
  data () {
    return {
      window: {
        height: 0,
        width: 0
      }
    }
  },
  computed: {
    ...mapState({
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang,
      _resizeWindow: state => state.report._resizeWindow
    })
  },
  methods: {
    goToGrowthyMap () {
      let alreadySetProjectId = window.localStorage.setProjectId
      // fixme 링크
      if (window.location.href.indexOf('analytics.growthy.game.line.me') > -1) {
        window.location.href = 'https://map.growthy.game.line.me/wizard/datadesign/' + alreadySetProjectId
      } else if (window.location.href.indexOf('analytics-beta.growthy.game.line-alpha.me') > -1) {
        window.location.href = 'http://map-beta.growthy.game.line-alpha.me/wizard/datadesign/' + alreadySetProjectId
      } else {
        window.location.href = 'http://map.growthy.game.line-alpha.me/wizard/datadesign/' + alreadySetProjectId
      }
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight - 64
    }
  },
  created () {
    this.handleResize()
  }
}
</script>
