<template>
<div class="indicator_area" v-if="!isShowLoading">
  <div :class="`indicator ${indicatorSize}`">
    <div class="preloader-wrapper active">
      <div class="spinner-layer">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
      </div>
    </div>
  </div>
  <!-- <div class="indicator_message">
      <span>Loading..</span>
  </div> -->
</div>
</template>
<script>
export default {
  name: 'LoadingBar',
  props: {
    isShowLoading: Boolean,
    indicatorSize: {
      type: String,
      required: false,
      default: 'big'
    }
  }
}
</script>

<style scoped>
.indicator_area .indicator {
  display: block !important;
  position: initial !important;
}
.indicator_area .indicator_message {
  position: initial !important;
  width: 100% !important;
  margin-left: 0px !important;
  margin-top: 5px !important;
}
</style>

