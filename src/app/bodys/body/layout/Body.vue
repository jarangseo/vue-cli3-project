<template>
  <div id="wrap">
    <app-header
      v-if="$route.query.fullPage !== 'pivot'"
      :checkNoticeBanner="checkNoticeBanner"
    >
    </app-header>
    <section>
      <div class="container">
        <!-- [D] 높이값(height)을 inline으로 적용 필요(resize 대응필요) -->
        <!-- [D] 배너 높이 (40px) 와 header 높이(64px) 상태에 따른 계산 후 적용 필요 -->
        <div class="inner_container" :style="{ height: contentHeight }">
          <nav-menu v-if="$route.query.fullPage !== 'pivot'"></nav-menu>
          <router-view></router-view>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from './Header'
import NavMenu from './NavMenu'
import _ from 'lodash'
export default {
  components: {
    AppHeader: Header,
    NavMenu
  },
  data () {
    return {
      contentHeight: 'calc(100vh - 64px)'
    }
  },
  computed: {
    // ...mapState({
    //   apiUserHasRoles: state => state.user._userHasRoles
    // })
  },
  methods: {
    goToReport () {
      let query = _.cloneDeep(this.$route.query)
      delete query.fullPage
      this.$router.replace({ name: 'basic', query })
    },
    checkNoticeBanner (isShow) {
      if (isShow === true) {
        this.contentHeight = 'calc(100vh - 104px)'
      } else {
        this.contentHeight = 'calc(100vh - 64px)'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  }
}
</script>
<style lang="scss" scoped>
  .nonVisible {
    visibility: hidden;
  }
</style>
