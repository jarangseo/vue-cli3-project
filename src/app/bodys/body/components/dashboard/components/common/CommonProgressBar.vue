<template>
  <progress-bar 
    v-if="percent"
    type="line" ref="line" strokeWidth="1" :color="color" ></progress-bar>
</template>
<script>
export default {
  name: 'CommonProgressBar',
  props: {
    color: {
      type: String,
      required: true,
      default: ''
    },
    percent: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  mounted: function () {
    if (this.$refs.line) {
      // this.$refs.line.animate(this.percent / 100)
      this.$refs.line.set(this.percent / 100)
    }
  }
}
</script>

<style scoped>
</style>

