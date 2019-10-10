<template>
  <!-- LNB -->
  <!-- [D] LNB 닫힌 상태일 경우, close 클래스 추가 필요, 열린 상태일 경우 추가 클래스 없음 -->
  <!--
      [D] LNB 닫힌 상태에서 마우스 오버시 over 클래스 추가 필요
      [D] LNB 닫힌 상태에서만(class="include_nav close") 마우스 오버 인터렉션 움직임.
      ex) 닫힌 상태에서 마우스 오버시 : class="include_nav close over
  -->
  <!-- [D] default 는 닫힌 상태로 clase 클래스 적용이 필요함 -->
  <div class="include_nav" :class="{ 'close': _isOpenMenu, 'over': isOverNavMenu }" @mouseleave="openNavMenu(false)">
    <div class="nav_section">
      <div class="nav_top">
        <div class="project_img">
          <div class="img_area" v-tooltip.right-start="{content: _projectInfo.name}">
            <span class="img_mask"></span>
            <img v-if="_projectInfo && _projectInfo.iconUrl" :src="_projectInfo.iconUrl" width="100%" height="100%" alt=""/>
            <img v-else src="~@/assets/img/@img_project_profile.png" width="100%" height="100%" alt="" />
          </div>
        </div>
        <div class="project_name">
          <a href="#" @click.prevent="toggleProjectSearchMadal" class="btn_project_list">
            <!-- [D] 2줄 이상일 경우 말줄임(...) 적용 필요 -->
            <!--
                [D] 리스트 내 검색문자 표기시 span 내 em구조 추가 필요
                ex) pr 검색시 : Project name -> <em>Pr</em>oject name
            -->
            <span :class="{'text_view_row_limit': (_projectInfo.name && _projectInfo.name.length) > 18}">{{ _projectInfo.name }}</span>
          </a>
        </div>
        <!-- Project Search layer -->
        <!-- [D] 노출시 dispaly:block 적용 필요 -->
        <div class="project-search-modal-dimmed-layer" v-if="isProjectSearchModalShow" @click="toggleProjectSearchMadal"></div>
        <project-search
          v-if="isProjectSearchModalShow"
          @click="changeProjectParent"
          :currentProjectId="currentProjectId"
        >
        </project-search>
      </div>
      <div class="inner_nav_section">
        <ul class="depth_menu one">
          <!-- [D] paid 처리된 메뉴일 경우 a에 paid 클래스 추가 필요 -->
          <!-- Dashboard 임시 메뉴 [START] -->
          <!--
          <li class="depth_group open" style="position: relative;">
           <a href="/overview" ><span>Dashboard<em>Test</em></span></a>
          </li>
          -->
          <!-- Dashboard 임시 메뉴 [END] -->

          <!-- [D] 하위 메뉴가 있을경우 li에  depth_group 클래스 추가 필요 -->
          <!-- [D] 메뉴 선택시 li에 selected 클래스 추가 필요 -->
          <li v-for="(oneDepthMenu, indexOne) in _menuList" :key="indexOne" class="depth_group" :class="{'open' : oneDepthMenu.isOpen}" style="position: relative;">
            <!-- [D] paid 처리된 메뉴일 경우 a에 paid 클래스 추가 필요 -->
            <a v-if="oneDepthMenu.glossaryInfo && oneDepthMenu.glossaryInfo.tooltip" v-tooltip.top="{ content: oneDepthMenu.glossaryInfo.tooltip, boundariesElement: 'viewport' }" href="#" @click.prevent="() => { oneDepthMenu.isOpen = !oneDepthMenu.isOpen }" :class="{'paid' : _projectInfo.billingStatus === 'FREE' && oneDepthMenu.isPaidUsed}"><span>{{ oneDepthMenu.name }}<em v-if="oneDepthMenu.menuIcon">{{ oneDepthMenu.menuIcon }}</em></span></a>
            <a v-else href="#" @click.prevent="() => { oneDepthMenu.isOpen = !oneDepthMenu.isOpen }" :class="{'paid' : _projectInfo.billingStatus === 'FREE' && oneDepthMenu.isPaidUsed}"><span>{{ oneDepthMenu.name }}<em v-if="oneDepthMenu.menuIcon">{{ oneDepthMenu.menuIcon }}</em></span></a>
            <ul class="depth_menu two" v-if="oneDepthMenu.isTwoDepthMenu">
              <li>
                <ul class="group_menu">
                  <template v-for="(twoDepthMenu, index) in oneDepthMenu.menuTwoDepthList">
                    <template v-if="twoDepthMenu.glossaryInfo && twoDepthMenu.glossaryInfo.tooltip">
                      <span v-if="twoDepthMenu.type === 'TA04'" class="menu_group_title" v-tooltip.top="{ content: twoDepthMenu.glossaryInfo.tooltip, boundariesElement: 'viewport' }" :key="`group_menu_title_glossaryinfo_span_${index}`" >{{ twoDepthMenu.name }}</span>
                      <!-- [D] 메뉴 선택시 li에 selected 클래스 추가 필요 -->
                      <li v-else :class="{ 'selected' : selectTwoDepthMenuId === twoDepthMenu.id }"  :key="`group_menu_title_glossaryinfo_li_${index}`">
                        <!-- [D] paid 처리된 메뉴일 경우 a에 paid 클래스 추가 필요 -->
                        <a href="#" @click.prevent="selectMenuItem(oneDepthMenu.id, twoDepthMenu.id, twoDepthMenu)" v-tooltip.top="{ content: twoDepthMenu.glossaryInfo.tooltip, boundariesElement: 'viewport' }" :class="{'paid' : _projectInfo.billingStatus === 'FREE' && (oneDepthMenu.isPaidUsed || twoDepthMenu.isPaidUsed)}"><span>{{ twoDepthMenu.name }}<em v-if="twoDepthMenu.menuIcon">{{ twoDepthMenu.menuIcon }}</em></span></a>
                      </li>
                    </template>
                    <template v-else>
                      <span v-if="twoDepthMenu.type === 'TA04'" class="menu_group_title" :key="`group_menu_title_none_glossaryinfo_span_${index}`" >{{ twoDepthMenu.name }}</span>
                      <!-- [D] 메뉴 선택시 li에 selected 클래스 추가 필요 -->
                      <li v-else :class="{ 'selected' : selectTwoDepthMenuId === twoDepthMenu.id }" :key="`group_menu_title_none_glossaryinfo_li_${index}`">
                        <!-- [D] paid 처리된 메뉴일 경우 a에 paid 클래스 추가 필요 -->
                        <a href="#" @click.prevent="selectMenuItem(oneDepthMenu.id, twoDepthMenu.id, twoDepthMenu)" :class="{'paid' : _projectInfo.billingStatus === 'FREE' && (oneDepthMenu.isPaidUsed || twoDepthMenu.isPaidUsed)}"><span>{{ twoDepthMenu.name }}<em v-if="twoDepthMenu.menuIcon">{{ twoDepthMenu.menuIcon }}</em></span></a>
                      </li>
                    </template>
                  </template>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- [D] LNB가 닫힌 상태에서만 노출되는 영역 -->
      <div class="inner_close_nav_section" @mouseover="openNavMenu(true)">
        <ul>
          <li>
            <div class="hidden_item">
              <span class="ico_hidden_menu"><em class="blind">hidden_menu</em></span>
            </div>
          </li>
        </ul>
      </div>
      <div class="nav_bottom">
        <ul>
          <!--<li>
              <a href="#" @click.prevent="showAllMenu" class="btn_nav all_menu"><span>View all menu</span></a>
          </li>-->
          <li>
            <div class="btn_nav nav_action">
              <a href="#" @click.prevent="toggleNavMenu" class="btn_move_nav"><span class="blind">open/close</span></a>
            </div>
          </li>
        </ul>
      </div>
      <!-- all menu -->
      <all-menu
        v-if="isAllMenuModalShow">
      </all-menu>
    </div>
  </div>
</template>
<script>
import AllMenu from './AllMenu'
import ProjectSearch from './ProjectSearch'
import { common } from '@/shared/utils/common'
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
import _ from 'lodash'
import '@/assets/css/tooltip/vtooltip.css'

export default {
  name: 'NavMenu',
  components: {
    AllMenu,
    ProjectSearch
  },
  data () {
    return {
      isAllMenuModalShow: false,
      isProjectSearchModalShow: false,
      isMinifiedNavMenu: false,
      isOverNavMenu: false,
      menuId: -1,
      currentProjectId: '',
      selectOneDepthMenuId: '',
      selectTwoDepthMenuId: '',
      _activeModal: state => state.common._activeModal,
    }
  },
  watch: {
    '$route.query.parentMenuId' (d) {
      this.changeActiveMenu(this._menuList)
    },
    '$route.query.menuId' (d) {
      this.changeActiveMenu(this._menuList)
    },
    _menuList (d, n) {
      if (d !== n) this.changeActiveMenu(d)
    },
    _projectInfo (d) {
      if (d) {
        this.currentProjectId = d.projectId
        localStorage.setItem('setProjectId', this.currentProjectId)
        this.getMenuList()
      }
    },
    isMinifiedNavMenu (isMinified) {
      this.$store.commit(types.TOGGLE_LEFT_MENU, isMinified)
    },
    _activeModal (activeModal) {
      activeModal !== this.$options.name ? this.toggleProjectSearchMadal() : ''
    },
    me () {
      this.getMenuList()
    }
  },
  computed: {
    ...mapState({
      _projectInfo: state => state.project._projectInfo,
      _menuList: state => state.menu._menuList,
      _isOpenMenu: state => state.menu._isOpenMenu,
      me: state => state.common._me
    }),
    common () {
      return common
    }
  },
  methods: {
    showAllMenu () {
      this.isAllMenuModalShow = !this.isAllMenuModalShow
    },
    toggleProjectSearchMadal () {
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
      common.layerPopupToggle(this, 'isProjectSearchModalShow')
    },
    toggleNavMenu () {
      this.isMinifiedNavMenu = !this.isMinifiedNavMenu
      this.isOverNavMenu = false
    },
    openNavMenu (isOver) {
      if (this.isMinifiedNavMenu) {
        this.isOverNavMenu = isOver
      }
    },
    changeProjectParent (projectId) {
    this.$route.query.parentMenuId = ''
      this.$route.query.menuId = ''
      this.currentProjectId = projectId
      this.getProjectInit()
      common.layerPopupClose()
    },
    setMenuId () {
      window.localStorage.setItem('oneDepthMenuId', this.selectOneDepthMenuId)
      window.localStorage.setItem('twoDepthMenuId', this.selectTwoDepthMenuId)
    },
    selectMenuItem (oneDepthId, twoDepthId, twoDepthObj) {
      let query = this.$route.query
      this.selectOneDepthMenuId = oneDepthId
      this.selectTwoDepthMenuId = twoDepthId
      // fixme router 링크
      this.$store.commit(types.SET_ACTIVE_MENU, twoDepthObj)

      this.setMenuId()
      // [to-do] 추후에 type값으로 isDashboard 값을 판단하도록 수정
      // [code] twoDepthObj && twoDepthObj.type === 'TA03'
      // console.log('twoDepthObj: ', twoDepthObj)
      if (!twoDepthObj.menuThreeDepthList[0].keyword) twoDepthObj.menuThreeDepthList[0].keyword = ''
      const routerName = twoDepthObj && twoDepthObj.type === 'TA03'
                      ? (twoDepthObj.menuThreeDepthList[0].keyword.includes('Dash_2') ? 'realtime' : 'overview')
                      : 'basic'
      // let revenue = (routerName !== 'basic' && _.includes(['Dash_1_2', 'Dash_2_2'], twoDepthObj.menuThreeDepthList[0].dashboardKey)) ? 'fasle' : 'true'
      if (routerName !== 'basic' && !window.localStorage.getItem('isDaily')) window.localStorage.setItem('isDaily', 'true')
      this.$router.replace({
                            // [to-do] 'realtime' 부분은 대시보드키값에 따라서 realtime 이나 overview로 분기되도록 할 예정.
                            name: routerName,
                            params: {projectId: this.currentProjectId},
                            query: routerName === 'basic'
                                    ? { parentMenuId: oneDepthId, menuId: twoDepthId, threeDepth: query.threeDepth }
                                    : { parentMenuId: oneDepthId, menuId: twoDepthId, threeDepth: query.threeDepth,
                                        revenue: _.includes(['Dash_1_1', 'Dash_2_1'], twoDepthObj.menuThreeDepthList[0].keyword)
                                                ? 'true' : 'false',
                                        daily: window.localStorage.getItem('isDaily')
                                      }
                          }).catch(err => {})
      // 아래 코드가 원본
      // this.$router.replace({ name: 'basic', params: {projectId: this.currentProjectId}, query: { parentMenuId: oneDepthId, menuId: twoDepthId, threeDepth: query.threeDepth } })
    },
    getMenuList () {
      this.$store.dispatch(types.GET_MENU_LIST, { projectId: this.currentProjectId, thisComponent: this })
    },
    getProjectInit () {
      this.$store.dispatch(types.GET_PROJECT_INIT, {projectId: this.currentProjectId, thisComponent: this})
    },
    notFoundProject () {
      this.$router.push({ name: 'NoProject' })
    },
    goToDetailReport () {
      let query = _.cloneDeep(this.$route.query)
      if (this.$route.name === 'basic') {
        this.$router.replace({ name: 'basic', params: {projectId: this._projectInfo.projectId}, query: { parentMenuId: query.parentMenuId, menuId: query.menuId, threeDepth: query.threeDepth } }).catch(err => {})
      } else if (this.$route.name === 'overview' || this.$route.name === 'realtime') {
        this.$router.replace({ name: this.$route.name, params: {projectId: this._projectInfo.projectId}, query: { parentMenuId: query.parentMenuId, menuId: query.menuId, threeDepth: query.threeDepth, revenue: query.revenue} }).catch(err => {})
      } else {
        this.$router.replace({ name: this.$route.name }).catch(err => {})
      }
    },
    catchCategoryError () {
      if(!['/overview', '/realtime'].includes(window.location.pathname)) this.$router.replace({ name: 'NoCategory' })
    },
    changeActiveMenu (d) {
      let menuList = [...d]
      let isOpen = false
      const selectOneDepthMenuId = this.$route.query.parentMenuId
      const selectTwoDepthMenuId = this.$route.query.menuId
      _.map(menuList, (oneDepthMenu, index) => {
        const isTwoDepthMenu = !!oneDepthMenu.menuTwoDepthList

        this.$set(oneDepthMenu, 'isTwoDepthMenu', isTwoDepthMenu)

        if (selectOneDepthMenuId && selectTwoDepthMenuId && isTwoDepthMenu) {
          if (oneDepthMenu.id === Number(selectOneDepthMenuId)) {
            this.$set(oneDepthMenu, 'isOpen', true)
            isOpen = true
            _.map(oneDepthMenu.menuTwoDepthList, (twoDepthMenu) => {
              if (twoDepthMenu.id === Number(selectTwoDepthMenuId)) {
                this.selectMenuItem(oneDepthMenu.id, twoDepthMenu.id, twoDepthMenu)
              }
            })
          } else {
            this.$set(oneDepthMenu, 'isOpen', false)
          }
        }
      })
      if (!isOpen) {
        _.map(menuList, (oneDepthMenu, index) => {
          const isTwoDepthMenu = !!oneDepthMenu.menuTwoDepthList
          if (isTwoDepthMenu && !isOpen) {
            _.map(oneDepthMenu.menuTwoDepthList, (twoDepthMenu) => {
              if (twoDepthMenu.type !== 'TA04' && !isOpen) {
                isOpen = true
                this.$set(oneDepthMenu, 'isOpen', true)
                this.selectMenuItem(oneDepthMenu.id, twoDepthMenu.id, twoDepthMenu)
              }
            })
          }
        })
      }
    }
  },
  created () {
    let projectId = this.$route.params.projectId || localStorage.getItem('setProjectId')
    if (projectId) {
      this.currentProjectId = projectId
    }
    if(!['/overview', '/realtime'].includes(window.location.pathname)) this.getProjectInit()
  },
  mounted () {
    let navEl = document.querySelector('.include_nav')
    navEl.addEventListener('transitionend', (e) => {
      // navEl 이하 모든 엘리먼트가 transitionend callback을 호출하기 때문에 한번만 호출하려면 아래 if문 필요
      if (e.target === navEl) {
        this.$store.commit(types.TRANSITION_END)
      }
    })
  },
  destroyed () {
    document.querySelector('.include_nav').removeEventListener('transitionend', () => {})
  }
}
</script>
<style lang="scss">
.text_view_row_limit {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>
