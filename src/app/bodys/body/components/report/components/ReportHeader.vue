<template>
<div class="content_title_section">
    <span class="service_depth">{{ oneDepthName }}</span>
    <div class="service_depth_info">
        <h2>{{ twoDepthName }}</h2><a href="#" @click.prevent="toggleRightPanel" class="btn_ico_help"><span class="blind">help</span></a>
    </div>
    <div class="gnb_menu">
        <ul v-if="_twoDepthMenuInfo.type ==='TA01'">
          <!-- [D] 메뉴 선택시 li에 on 추가 필요 -->
          <li :class="{'on': selectedMenuIdx === key}" v-for="(tab, key) in _twoDepthMenuInfo.menuThreeDepthList" :key="key"
              ><a @click="changeTab(key)" class="btn_menu one">{{tab.name}}</a>
          </li>
        </ul>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import * as types from '@/shared/stores/types'

export default {
  name: 'ReportHeader',
  props: {
    oneDepthName: {
      type: String,
      default: ''
    },
    twoDepthName: {
      type: String,
      default: ''
    }
  },
  watch: {
    '$route.query.threeDepth' (d) {
      this.selectedMenuIdx = d ? d * 1 : 0
    }
  },
  computed: {
    ...mapState({
      _projectInfo: state => state.project._projectInfo,
      _twoDepthMenuInfo: state => state.menu._twoDepthMenuInfo
    })
  },
  data () {
    return {
      selectedMenuIdx: 0
    }
  },
  methods: {
    toggleRightPanel () {
      this.$store.commit(types.TOGGLE_RIGHT_PANEL)
      this.$store.commit(types.CHECK_RIGHT_PANNEL, 'about_report')
    },
    changeTab (idx) {
      let query = _.cloneDeep(this.$route.query)
      let projectId = this._projectInfo.projectId
      this.selectedMenuIdx = idx
      query.threeDepth = this.selecteqdMenuIdx + ''
      this.$router.replace({ name: 'basic', params: {projectId}, query: { parentMenuId: query.parentMenuId, menuId: query.menuId, threeDepth: idx } })
    }
  },
  mounted () {
    let threeDpethIdx = this.$route.query.threeDepth
    if (threeDpethIdx) {
      this.selectedMenuIdx = threeDpethIdx * 1
    } else {
      this.selectedMenuIdx = 0
    }
  }
}
</script>
