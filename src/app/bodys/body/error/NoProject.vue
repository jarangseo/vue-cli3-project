<template>
  <div id="wrap">
    <app-header></app-header>
    <section>
      <div class="container">
        <!-- [D] 높이값(height)을 inline으로 적용 필요(resize 대응필요) -->
        <!-- [D] 배너 높이 (40px) 와 header 높이(64px) 상태에 따른 계산 후 적용 필요 -->
        <div class="inner_container" v-bind:style="{ height: window.height + 'px' }">
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
                    <div class="inner_error_message no_permisson">
                      <span class="message">Access Error</span>
                      <p>{{dataBySelectedLang.analytics_error_msg_noproject}}</p>
                      <!-- <a @click="refresh()" class="btn_page_refresh"><span>REFRESH</span></a> -->
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
import { mapState } from 'vuex'

export default {
  name: 'NoProject',
  components: {
    AppHeader: Header,
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
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight - 64
    },
    refresh () {
      this.$router.go(-1)
    }
  },
  created () {
    this.handleResize()
  }
}
</script>
