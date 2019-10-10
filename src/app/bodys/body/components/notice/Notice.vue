<template>
    <!--  팝업 (1100x770) -->
    <div id="pop_wrap" class="pop_wrap" style="height: 770px;width: 1100px;">
        <div class="pop_container">
            <h1>Notice</h1>
            <div class="popup_notice_section">
                <div class="popup_notice_list">
                    <ul>
                        <li v-for="(item, i) in _noticeList" :key="i">
                            <!-- [D] 공지사항 고정시 a에 notice 클래스 추가 필요 -->
                            <a :class="{notice : item.isNew}">
                                <div class="s_division"><strong>GROWTHY</strong> Analytics</div>
                                <div class="notice_title" @click="detailNotice(item.id)">{{ item.title }}</div>
                                <div class="notice_write_date">{{ moment(item.createDate).format('YYYY-MM-DD HH:mm:SS') }}</div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <pagination
              :pageInfo="_pageInfo"
              :moveTo="moveTo"
              :changePage="changePage"
              :moveToFront="moveToFront"
              :moveToEnd="moveToEnd"
            ></pagination>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
// import _ from 'lodash'
import moment from 'moment'
import Pagination from '../common/Pagination'

export default {
  name: 'Notice',
  components: {
    Pagination
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
      _noticeList: state => state.notice._noticeList,
      _pageInfo: state => state.notice._pageInfo,
      _resizeWindow: state => state.report._resizeWindow
    }),
    moment () {
      return moment
    }
  },
  methods: {
    init () {
      this._pageInfo.currentPage = this.$route.params.pageNumber || 1
      this.getNoticeList()
    },
    getNoticeList () {
      this.$store.dispatch(types.GET_NOTICE_LIST, { page: this._pageInfo.currentPage })
    },
    detailNotice (id) {
      this.$router.push({ name: 'Notice.edit', params: { noticeId: id, pageNumber: this._pageInfo.currentPage } })
    },
    moveToFront () {
      let pageinfo = this._pageInfo
      pageinfo.currentPage = 1
      this.getNoticeList()
    },
    moveToEnd () {
      let pageinfo = this._pageInfo
      pageinfo.currentPage = pageinfo.totalPage
      this.getNoticeList()
    },
    moveTo (type) {
      let pageinfo = this._pageInfo
      if (type === 'down') {
        pageinfo.currentPage = pageinfo.currentPage - 1
      } else if (type === 'up') {
        pageinfo.currentPage = pageinfo.currentPage + 1
      }
      this.getNoticeList()
    },
    changePage (idx) {
      let pageinfo = this._pageInfo
      pageinfo.currentPage = idx
      this.getNoticeList()
    },
    handleResize () {
      this.window.width = 1117
      this.window.height = 835
      window.resizeTo(this.window.width, this.window.height)
    }
  },
  created () {
    this.init()
    this.handleResize()
  }
}
</script>
