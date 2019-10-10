<template>
  <div id="wrap">
    <app-header></app-header>
    <section>
      <div class="container">
        <!-- [D] 높이값(height)을 inline으로 적용 필요(resize 대응필요) -->
        <!-- [D] 배너 높이 (40px) 와 header 높이(64px) 상태에 따른 계산 후 적용 필요 -->
        <div class="inner_container" v-bind:style="{ height: window.height + 'px' }">
          <!-- [D] LNB가 없는 Error 페이지는 content에 error 클래스 추가 필요  -->
          <nav-menu></nav-menu>
          <div class="content error" style="margin-left: 260px;">
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
                    <div class="inner_error_message not_d_log">
                      <span class="message">Deploy Log</span>
                      <p>{{dataBySelectedLang.analytics_error_msg_deploylog}}</p>
                      <div class="message_box">
                        <p>{{dataBySelectedLang.analytics_error_msg_deployloglist}}</p>
                        <span>Predefine &gt; Playend<br>Prdefine &gt; Money</span>
                      </div>
                      <span class="more_info">{{dataBySelectedLang.analtyics_error_msg_nocategoryauth}}</span>
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
import NavMenu from '../layout/NavMenu'
import FooterPanel from '../layout/FooterPanel.vue'
import { mapState } from 'vuex'

export default {
  name: 'NoDeployLog',
  components: {
    AppHeader: Header,
    NavMenu,
    FooterPanel
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
      // fixme 링크
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
