<template>
<div class="indicator_area" v-if="!isShowLoading">
  <div class="indicator big">
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
  <div class="indicator_message">
      <span>Loading..</span>
  </div>
</div>
</template>
<script>
export default {
  name: 'LoadingBar',
  props: {
    isShowLoading: Boolean
  }
}
</script>
