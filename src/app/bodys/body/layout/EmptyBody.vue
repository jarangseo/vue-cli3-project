<template>
  <router-view></router-view>
</template>

<script>
import Header from './Header'
import NavMenu from './NavMenu'
import RightPanel from '../RightPanel'

export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  beforeRouteEnter (to, from, next) {
    next()
  }
}
</script>
