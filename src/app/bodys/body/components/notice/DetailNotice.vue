<template>
  <!--  팝업 (1100x770) -->
  <div id="pop_wrap" class="pop_wrap" style="height: 770px;width: 1100px;">
    <div class="pop_container">
      <h1>Notice</h1>
      <div class="popup_notice_section">
        <div class="popup_notice_detail">
          <div class="service_name">
            <!-- [D] 서비스 명에 따라 growthy에 추가 클래스 적용 필요 -->
            <!--
                Growthy : 추가 없음
                Growthy Analytics : analytics 클래스 추가
                Growthy Map : map 클래스 추가
            -->
            <span class="growthy analytics"><strong class="blind">growthy</strong></span><span class="sub_title">Notice</span>
          </div>
          <div class="notice_info_area">
            <h2>{{ _noticeInfo.title }}</h2>
            <span class="write_date">{{ _noticeInfo.createDate ? moment(_noticeInfo.createDate).format('YYYY-MM-DD HH:mm:SS') : '' }}</span>
          </div>
          <div class="notice_content">
            <div class="inner_notice_content quillWrapper">
              <div class="ql-container ql-snow" style="border: none;">
                <div class="ql-editor" v-html="_noticeInfo.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup_btn_area">
        <div class="right_area">
          <ul>
            <li><a href="#" @click.stop.prevent="goToNoticeList" class="btn list">LIST</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
// import _ from 'lodash'
import moment from 'moment'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'DetailNotice',
  components: {
  },
  watch: {
    _resizeWindow () {
      this.handleResize()
    }
  },
  data () {
    return {
      window: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    ...mapState({
      _noticeInfo: state => state.notice._noticeInfo,
      _resizeWindow: state => state.report._resizeWindow
    }),
    moment () {
      return moment
    }
  },
  methods: {
    getNoticeInfo () {
      this.$store.dispatch(types.GET_NOTICE, { id: this.$route.params.noticeId })
    },
    goToNoticeList () {
      this.$router.push({ name: 'Notice', params: { pageNumber: this.$route.params.pageNumber } })
    },
    handleResize () {
      this.window.width = 1117
      this.window.height = 835
      window.resizeTo(this.window.width, this.window.height)
    }
  },
  created () {
    this.getNoticeInfo()
    this.handleResize()
  }
}
</script>
