<template>
  <div class="include_header">
    <!-- Announcement Banner -->
    <div class="anno_banner_section" v-if="isShowNoticeBanner" style="display: flex;">
      <div style="flex: auto;">
        <span class="banner_info">{{ _noticeUrgency.title }}</span>
        <a href="#" @click.prevent="goToNotice(_noticeUrgency.id)" class="btn_more">View More</a>
      </div>
      <div style="margin-left: auto;padding-right: 15px;" @click="notDisplayNotice">
        <span class="fn-map fn-map-014-close" style="text-align: right;margin-left: 30px;line-height: 42px;vertical-align: top;cursor: pointer;"></span>
      </div>
    </div>
    <!-- header -->
    <div class="header_section">
      <div class="sevice_logo">
        <a @click.prevent="goToFirstMenu" class="brand_logo"><h1><span class="blind">GROWTHY Analytics</span></h1></a>
      </div>
      <div class="more_menu">
        <div class="guide-popup-modal-dimmed-layer" @click="toggle(0)" v-if="open[0]"></div>
        <div class="gm-menu-popup-modal-dimmed-layer" @click="toggle(1)" v-if="open[1]"></div>
        <div class="user-popup-modal-dimmed-layer" @click="toggle(2)" v-if="open[2]"></div>
        <div class="guide_more">
          <div class="guide_more_inner">
            <ul>
              <li><a href="#" @click.prevent="showGlossaryList" class="btn_menu_item">Glossary</a></li>
              <li class="guide-menu">
                <a href="https://wiki.linecorp.com/x/ABKsWw" target="blank" class="btn_menu_item">Guide</a>
                <!-- [D] btn_ico_guide 버튼 클릭시 guide_detail_menu에 display:block 적용 필요, 추후 변경 가능할 수 있으므로 아래내용 주석으로 처리 -->
                <!-- <div class="guide_detail_menu" v-if="open[0]">
                  <ul>
                    <li><a href="#" @click.prevent=""><span><em>English</em><i class="fn-map-025-file_download  fn-16 fn-map"></i></span></a></li>
                    <li><a href="#" @click.prevent=""><span><em>Japanese</em><i class="fn-map-025-file_download  fn-16 fn-map"></i></span></a></li>
                    <li><a href="#" @click.prevent=""><span><em>Korean</em><i class="fn-map-025-file_download  fn-16 fn-map"></i></span></a></li>
                  </ul>
                </div> -->
              </li>
            </ul>
          </div>
          <div class="ico_guide_more">
            <a href="#" @click.prevent="showNoticeList" class="btn_ico_guide"><span class="blind">notice</span></a>
            <!-- [D] btn_ico_guide 버튼 클릭시 guide_detail_menu에 display:block 적용 필요 -->
            <!--<div class="guide_detail_menu" style="display:none;">
                <ul>
                    <li><a href="#" @click.prevent=""><span>FAQ</span></a></li>
                    <li><a href="#" @click.prevent=""><span>Forum</span></a></li>
                    <li><a href="#" @click.prevent=""><span>Document</span></a></li>
                    <li><a href="#" @click.prevent=""><span>Notice</span></a></li>
                </ul>
            </div>-->
          </div>
        </div>
        <div class="service_list">
          <a href="#" @click.prevent="toggle(1)" class="btn_service"><span class="blind">service list</span></a>
          <!-- [D] btn_service 버튼 클릭시 service_category에 display:block 적용 필요 -->
          <div class="service_category" v-if="open[1]">
            <ul>
              <li><a href="#" @click.prevent="goToGrowthyMap" class="btn s_map"><span class="blind">GROWTHY Map</span></a></li>
            </ul>
          </div>
        </div>
        <div class="account_login">
          <!-- [D] 버튼 클릭시(선택시) btn_account_area 에 selected 클래스 추가 필요 -->
          <a href="#" @click.prevent="toggle(2)" class="btn_account_area" :class="{ 'selected' : open[2]}"><span class="account_info">{{ me.userName || '' }}</span><i class="fn-map-006-arrow_drop_down fn-map"></i></a>
          <!-- [D] btn_account_area 버튼 클릭시 account_detail_info에 display:block 적용 필요 -->
          <div class="account_detail_info" v-if="open[2]">
            <div class="more_detail_info">
              <span class="account_nickname">{{ me.userName || '' }}</span>
              <span class="account_email">{{ me.userEmail || '' }}</span>
            </div>
            <ul class="interval">
              <li>
                <!-- [D] 버튼 선택시 btn_set_more에 on 클래스 추가 필요 -->
                <a href="#" @click.prevent="toggleLanguage(true)" class="btn_set_more lang"><span>{{dataBySelectedLang.analytics_gnb_profile_language}}</span></a>
                <!-- [D] btn_set_more 버튼에 on 클래스 추가시 set_more_menu에 display:block 적용 필요 -->
                <div class="set_more_menu" v-if="languageSelect">
                  <ul class="language-selected">
                    <!-- [D] 메뉴 선택시 a에 on 클래스 추가 필요 -->
                    <li><a  @click.prevent="languageSelectMenu($event, 'en', 0)" :class="{on: selectedLanguageIdx === 0}"><span>English</span></a></li>
                    <li><a  @click.prevent="languageSelectMenu($event, 'jp', 1)" :class="{on: selectedLanguageIdx === 1}"><span>Japanese</span></a></li>
                    <li><a  @click.prevent="languageSelectMenu($event, 'kr', 2)" :class="{on: selectedLanguageIdx === 2}"><span>Korean</span></a></li>
                  </ul>
                </div>
              </li>
              <li>
                <!-- [D] 버튼 선택시 btn_set_more에 on 클래스 추가 필요 -->
                <a  @click.prevent="toggleCurrency(true)" class="btn_set_more money"><span>{{dataBySelectedLang.analytics_gnb_profile_currency}}</span></a>
                <!-- [D] btn_set_more 버튼에 on 클래스 추가시 set_more_menu에 display:block 적용 필요 -->
                <div class="set_more_menu" v-if="currencySelect">
                  <ul class="currency-selected">
                    <!-- [D] 메뉴 선택시 a에 on 클래스 추가 필요 -->
                    <li><a  @click.prevent="currencySelectMenu($event, 'usd', 0)" :class="{on: selectedCurrencyIdx === 0}"><span>USD($)</span></a></li>
                    <li><a  @click.prevent="currencySelectMenu($event, 'jpy', 1)" :class="{on: selectedCurrencyIdx === 1}"><span>JPY(¥)</span></a></li>
                    <li><a  @click.prevent="currencySelectMenu($event, 'krw', 2)" :class="{on: selectedCurrencyIdx === 2}"><span>KRW(₩)</span></a></li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="switch_menu">
                  <span>{{dataBySelectedLang.analytics_gnb_profile_savesetting}}</span>
                  <div class="report_save">
                    <!-- [D] 스위치 활성화시 switch-checkbox에 on 클래스 추가 필요.  -->
                    <div class="switch-checkbox" @click="toggleSaveReportSetting" :class="{ 'on' : isSaveReportSetting }">
                      <div class="switch">
                        <div class="switch-i"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="interval sign_out">
              <li><a v-if="me.userName" href="#" @click.prevent="logout"><span>Sign out</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import { util } from '@/shared/utils/util'
import * as types from '@/shared/stores/types'

export default {
  name: 'Header',
  props: {
    checkNoticeBanner: Function
  },
  components: {
  },
  data () {
    return {
      open: [false, false, false],
      languageSelect: false,
      currencySelect: false,
      isSaveReportSetting: false,
      isShowNoticeBanner: false,
      lastReportSet: false,
      selectedCurrencyIdx: -1,
      selectedLanguageIdx: -1,
      currency: '',
      language: ''
    }
  },
  watch: {
    _noticeUrgency (d) {
      if (d && !_.isEmpty(d) && typeof this.checkNoticeBanner === 'function') {
        /*let headerNoticeId = window.localStorage.getItem('headerNoticeId')
        if (!headerNoticeId || (headerNoticeId && (d.id !== Number(headerNoticeId)))) {
          this.isShowNoticeBanner = true
        }*/
        if (window.localStorage.getItem('headerNoticeId') * 1 === d.id) {
          this.isShowNoticeBanner = false
          this.$store.commit(types.SET_NOTICE_VISIBILITY, false)
        } else {
          this.isShowNoticeBanner = true
          this.$store.commit(types.SET_NOTICE_VISIBILITY, true)
        }
      } else {
        this.isShowNoticeBanner = false
        this.$store.commit(types.SET_NOTICE_VISIBILITY, false)
      }
      this.checkNoticeBanner(this.isShowNoticeBanner)
    },
    me(meData) {
      const languageArr = ['en', 'jp', 'kr']
      const currencyArr = ['usd', 'jpy', 'krw']
      let bwLangCur = util.browserDetectLangAndCurrency()
      let cookieLangCur = util.getLanguageAndCurrency()
      this.lastReportSet = meData.reportSet
      this.language  = meData.language || bwLangCur.language || 'en'
      this.selectedLanguageIdx = _.findIndex(languageArr, (lang) => lang === this.language)
      this.currency = meData.currency || bwLangCur.currency || 'usd'
      this.selectedCurrencyIdx = _.findIndex(currencyArr, (cur) => cur === this.currency)
      this.setInfoByLang(this.language)
      this.getReportSettingInfo()
      util.setLanguageAndCurrency(this.language, this.currency)
      this.getNoticeUrgency()
    },
    totalInfoData (d) {
      this.$nextTick(() => {
        this.setInfoByLang(this.language)
      })
    }
  },
  computed: {
    ...mapState({
      me: state => state.common._me,
      cookieUserIsLogin: state => state.common._userIsLogin,
      _noticeUrgency: state => state.notice._noticeUrgency,
      totalInfoData: state => state.common._lang.totalInfoData,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang
    })
  },
  methods: {
    getNoticeUrgency () {
      this.$store.dispatch(types.GET_NOTICE_URGENCY)
    },
    goToNotice (id) {
      let routeData = this.$router.resolve({ name: 'Notice.edit', params: { noticeId: id, pageNumber: 1 } })
      window.open(routeData.href, 'notice_popup', 'height=770,width=1100')
    },
    showNoticeList () {
      window.open('/notice', 'notice_popup', 'height=770,width=1100')
    },
    showGlossaryList () {
      window.open('/glossary', 'glossary_popup', 'height=856,width=1118')
    },
    getUserInfo () {
      this.$store.dispatch(types.GET_MY_INFO)
    },
    getLangInfo () {
      this.$store.dispatch(types.GET_LANG_DATA)
    },
    logout () {
      const setLanguage = window.localStorage.getItem('setLanguage') || 'browserDetecting'
      const i18nextLanguage = util.getI18nextLanguage()
      // window.localStorage.clear()
      this.$store.dispatch(types.USER_LOGIN_SET, false)
      let option = {
        path: '/',
        domain: this.hostname()
      }
      Cookies.remove('X-Linegame-UserToken', option)
      Cookies.remove('lgac', option)
      Cookies.remove('Probe-UserToken', option)
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        Cookies.remove(name, option)
        Cookies.remove(name)
        Cookies.remove(name.trim(), option)
        Cookies.remove(name.trim())
      }
      const errorPageList = ['NoDeployLog', 'NoCategory', 'NoProject', 'PageNotFound', 'NoDataPage']
      window.location.href = '/'
      this.removeSavedMenuInfo()
      this.resetLanguageSetting(setLanguage, i18nextLanguage)
    },
    removeSavedMenuInfo () {
      window.localStorage.removeItem('oneDepthMenuId')
      window.localStorage.removeItem('twoDepthMenuId')
      window.localStorage.removeItem('setProjectId')
    },
    resetLanguageSetting (setLanguage, i18nextLanguage) {
      window.localStorage.setItem('setLanguage', setLanguage)
      window.localStorage.setItem('i18nextLanguage', i18nextLanguage)
    },
    hostname () {
      return window.location.hostname.split('.').slice(-3).join('.')
    },
    foldAll () {
      this.open = this.open = this.open.map(() => false)
    },
    addCls (els, classNameToAdd) {
      els.className += ' ' + classNameToAdd
    },
    deleteSibling (valSibling) {
      for (let i = 0; i < valSibling.length; i++) {
        valSibling[i].removeAttribute('class')
      }
    },
    languageSelectMenu (event, lang, idx) {
      this.language = lang
      this.selectedLanguageIdx = idx
      this.toggleLanguage(false)
      this.changeLangAndCurrency()
    },
    setLanguageAndCurrency () {
      util.setLanguageAndCurrency(this.language, this.currency)
    },
    toggleLanguage (set) {
      this.currencySelect = false
      let thisSet = set || false
      if (thisSet) {
        this.languageSelect = !this.languageSelect
      } else {
        this.languageSelect = false
      }
    },
    currencySelectMenu (event, currency, idx) {
      this.selectedCurrencyIdx = idx
      this.currency = currency
      this.toggleCurrency(false)
      this.changeLangAndCurrency()
    },
    changeLangAndCurrency(){
      let userInfo = this.me
      userInfo.language = this.language
      userInfo.currency = this.currency
      this.$store.dispatch(types.POST_MY_INFO, userInfo)
    },
    changeReportSetInfo(setFlag) {
      if (!setFlag) {
        window.localStorage.removeItem('lastReportSetting')
      }
      this.$store.dispatch(types.POST_MY_INFO, {'language': this.language, 'currency': this.currency, 'reportSet': setFlag})
    },
    toggleCurrency (set) {
      this.languageSelect = false
      let thisSet = set || false
      if (thisSet) {
        this.currencySelect = !this.currencySelect
      } else {
        this.currencySelect = false
      }
    },
    toggle (openIdx) {
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
      this.toggleLanguage(false)
      this.toggleCurrency(false)
      let cur = this.open[openIdx]

      this.foldAll()
      this.open[openIdx] = !cur
    },
    toggleSaveReportSetting () {
      this.isSaveReportSetting = !this.isSaveReportSetting
      this.changeReportSetInfo(this.isSaveReportSetting)
    },
    notDisplayNotice () {
      this.isShowNoticeBanner = false
      this.$store.commit(types.SET_NOTICE_VISIBILITY, false)
      this.checkNoticeBanner(this.isShowNoticeBanner)
      window.localStorage.setItem('headerNoticeId', this._noticeUrgency.id)
    },
    goToGrowthyMap () {
      const path = window.location.origin
      if (path.indexOf('analytics-beta') > -1) {
        window.open('http://map-beta.growthy.game.line-alpha.me/project/list', '_blank')
      } else if (path.indexOf('alpha') > -1) {
        window.open('http://map.growthy.game.line-alpha.me/project/list', '_blank')
      } else {
        window.open('https://map.growthy.game.line.me/project/list', '_blank')
      }
    },
    goToFirstMenu () {
      window.localStorage.removeItem('oneDepthMenuId')
      window.localStorage.removeItem('twoDepthMenuId')
      window.location.href = '/'
    },
    detectLanguage () {
      let lang = window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage || 'en'
      let currency = 'usd'
      return {lang, currency}
    },
    getReportSettingInfo () {
      let reportSetting = this.lastReportSet || false
      if (reportSetting) {
        this.isSaveReportSetting = true
      } else {
        this.isSaveReportSetting = false
      }
    },
    setInfoByLang(lang) {
      const _lang = lang.toUpperCase()
      const SelectedData = this.totalInfoData.languageSet.filter(function (item){
        return Object.keys(item)[0] === _lang
      })
      SelectedData[0] ? this.$store.commit(types.SET_INFO_BY_LANG, SelectedData[0][_lang]) : ''
    }
  },
  created () {
    // let capCode = Cookies.get('X-LineGame-CAP-Code')
    // let userToken = Cookies.get('Probe-UserToken')
    this.getLangInfo()
    this.getUserInfo()
    this.getNoticeUrgency()
  }
}
</script>
<style lang="scss">
.guide-popup-modal-dimmed-layer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 8;
}
.user-popup-modal-dimmed-layer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 8;
}
.gm-menu-popup-modal-dimmed-layer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 8;
}
.guide-menu {
  z-index: 9;
}
.service_list {
  z-index: 9;
}
.account_login {
  z-index:9;
}
</style>
