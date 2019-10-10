<template>
  <div class="layer_project_search" @click="common.layerPopupInClick($event)">
    <div class="search_area">
      <div class="inner_search_area">
        <button><span class="ico_secrch"></span></button>
        <input v-model="searchKeyword" @input="searchKeyword = $event.target.value" type="text" id="p_search" placeholder="Project Search">
        <!-- [D] input에 검색어가 작성되면 버튼 노출됨(css 구현) -->
        <a v-if="searchKeyword.length > 0" href="#" @click.stop.prevent="clearSearchKeyword" class="clear_input"><span @click.stop.prevent="clearSearchKeyword" class="blind">clear</span></a>
      </div>
    </div>
    <div class="result_area">
      <!-- [D] 검색결과 또는 프로젝트 리스트가 있을 경우, display:block 적용필요 -->
      <div class="inner_result_area" style="height:385px;" v-if="(favoriteProjectList.length + normalProjectList.length) > 0">
        <!-- [D] bookmark(즐겨찾기) 체크시  bookmark_list 아래로 코드 이동적용 필요(li 단위로 이동) -->
        <!-- [D] 선택되어있는 항목은 il에 selected 클래스 추가 필요 -->
        <ul class="bookmark_list" v-show="favoriteProjectList.length > 0">
          <li v-for="(item, i) in favoriteProjectList" :key="i" :class="{'selected' : currentProjectId === item.projectId}">
            <div class="project_list_item">
              <div class="img_area">
                <span class="img_mask"></span>
                <img v-if="item.iconUrl" :src="item.iconUrl" width="100%" height="100%" alt=""/>
                <img v-else src="~@/assets/img/@img_project_profile2.png" width="100%" height="100%" alt=""/>
              </div>
              <div class="name_area">
                <!-- [D] 2줄 이상일 경우 말줄임(...) 적용 필요 -->
                <!--
                    [D] 리스트 내 검색문자 표기시 span 내 em구조 추가 필요
                    ex) pr 검색시 : Project name -> <em>Pr</em>oject name
                -->
                <!--<span>{{ item.name }}</span>-->
                <span style="cursor: pointer;" v-html="item.searchName" :class="{text_view_row_limit: item.searchName.length > 18}" @click="changeProject(item.projectId)"></span>
              </div>
              <!-- [D] 체크시 check_bookmark에 on 클래스 추가 필요 -->
              <a href="#" @click.prevent="deleteFavorite(item.projectId)" class="check_bookmark on"><span class="blind">bookmark</span></a>
              <!-- [D] 체크표시 노출시 check_sign에 on 클래스 추가 필요 -->
              <span class="check_sign" :class="{'on' : currentProjectId === item.projectId}"><span class="blind">check </span></span>
              <a href="#" @click.prevent="goToMapProject" class="check_setting"><span class="blind">setting</span></a>
            </div>
          </li>
        </ul>
        <!-- [D] bookmark(즐겨찾기) 체크 없을경우/체크해지 시 ul 아래로 코드 이동적용 필요(li 단위로 이동) -->
        <ul>
          <li v-for="(item, i) in normalProjectList" :key="i" :class="{'selected' : currentProjectId === item.projectId}">
            <div class="project_list_item">
              <div class="img_area">
                <span class="img_mask"></span>
                <img v-if="item.iconUrl" :src="item.iconUrl" width="100%" height="100%" alt="">
                <img v-else src="~@/assets/img/@img_project_profile3.png" width="100%" height="100%" alt="">
              </div>
              <div class="name_area">
                <!-- [D] 2줄 이상일 경우 말줄임(...) 적용 필요 -->
                <!--
                    [D] 리스트 내 검색문자 표기시 span 내 em구조 추가 필요
                    ex) pr 검색시 : Project name -> <em>Pr</em>oject name
                -->
                <!--<span>Sample <em>Pr</em>oject Sample project Sample project Sample project Sample project</span>-->
                <span style="cursor: pointer;" v-html="item.searchName" :class="{'text_view_row_limit': item.searchName.length > 18}" @click="changeProject(item.projectId)"></span>
              </div>
              <!-- [D] 체크시 check_bookmark에 on 클래스 추가 필요 -->
              <a href="#" @click.prevent="addFavorite(item.projectId)" class="check_bookmark"><span class="blind">bookmark</span></a>
              <!-- [D] 체크표시 노출시 check_sign에 on 클래스 추가 필요 -->
              <span class="check_sign" :class="{'on' : currentProjectId === item.projectId}"><span class="blind">check </span></span>
              <a href="#" @click.prevent="goToMapProject" class="check_setting"><span class="blind">setting</span></a>
            </div>
          </li>
        </ul>
      </div>
      <!-- [D] 검색결과 없을경우 display:block 적용필요 -->
      <!-- [D] 검색결과 없을 경우 아래 구조만 노출 (inner_result_area구조 삭제필요)-->
      <div class="result_nothing" v-else>
        <span>{{ isShowResultNothingMessage ? dataBySelectedLang.anaytics_lnb_msg_noresult : '' }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
import _ from 'lodash'
import { common } from '@/shared/utils/common'

export default {
  name: 'ProjectSearch',
  props: {
    currentProjectId: String
  },
  data () {
    return {
      searchKeyword: '',
      favoriteProjectList: [],
      normalProjectList: [],
      isShowResultNothingMessage: false
    }
  },
  watch: {
    searchKeyword (d) {
      let favoriteList = []
      let normalList = []
      this.isShowResultNothingMessage = true

      this._favoriteProjectList.filter(item => {
        if (_.toLower(item.name).indexOf(_.toLower(d)) > -1) {
          if (d) {
            item.searchName = item.name.replace(new RegExp(`(${d})`, 'gi'), `<em>$1</em>`)
          } else {
            item.searchName = item.name
          }
          favoriteList.push(item)
        }
        this.favoriteProjectList = [...favoriteList]
      })
      this._normalProjectList.filter(item => {
        if (_.toLower(item.name).indexOf(_.toLower(d)) > -1) {
          if (d) {
            item.searchName = item.name.replace(new RegExp(`(${d})`, 'gi'), `<em>$1</em>`)
          } else {
            item.searchName = item.name
          }
          normalList.push(item)
        }
        this.normalProjectList = [...normalList]
      })
    },
    _favoriteProjectList (d) {
      this.favoriteProjectList = [...d]
      _.map(this.favoriteProjectList, (item) => {
        item.searchName = item.name
      })
    },
    _normalProjectList (d) {
      this.normalProjectList = [...d]
      _.map(this.normalProjectList, (item) => {
        item.searchName = item.name
      })
    }
  },
  computed: {
    ...mapState({
      _favoriteProjectList: state => state.project._favoriteProjectList,
      _normalProjectList: state => state.project._normalProjectList,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang
    }),
    common () {
      return common
    }
  },
  methods: {
    getProjectList () {
      this.$store.dispatch(types.GET_PROJECT_LIST)
    },
    addFavorite (projectId) {
      this.$store.dispatch(types.POST_PROJECT_FAVORITE, { thisComponent: this, projectId: projectId })
    },
    deleteFavorite (projectId) {
      this.$store.dispatch(types.DELETE_PROJECT_FAVORITE, { thisComponent: this, projectId: projectId })
    },
    clearSearchKeyword () {
      this.searchKeyword = ''
      document.getElementById('p_search').value = ''
      this.getProjectList()
    },
    changeProject (projectId) {
      this.$emit('click', projectId)
    },
    goToMapProject () {
      const env = window.location.href.indexOf('analytics.growthy.game.line.me') > -1 ? 'real' : 'beta'
      let win

      switch (env) {
        case 'real':
          win = window.open('https://map.growthy.game.line.me/project/list', '_blank')
          break
        case 'beta':
          // 알파의 경우도 프로젝트 리스트는 beta에서 불러오기때문에 설정은 베타에서 해야함
          win = window.open('http://map-beta.growthy.game.line-alpha.me/project/list', '_blank')
          break
      }
      win.focus()
    }
  },
  created () {
    this.getProjectList()
  }
}
</script>
<style lang="scss">
.include_nav .nav_section .nav_top .layer_project_search .search_area .inner_search_area .clear_input {
  display: block !important;
  position: absolute;
  top: 18px;
  right: 20px;
  width: 16px;
  height: 16px;
}
</style>
