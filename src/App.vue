<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import { util } from '@/shared/utils/util'
import * as types from '@/shared/stores/types'

export default {
  components: {
  },
  created () {
    this.$root.componentsName = {}
    window.addEventListener('resize', () => {
      this.$store.commit(types.RESIZE_WINDOW)
    })
  }
}

Vue.filter('stringLengthComma', util.stringLengthComma)
Vue.filter('numberWithCommas', util.numberWithCommas)
Vue.filter('t', util.t)
</script>

<style lang="scss">
@import "~@/assets/styles/settings.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>

