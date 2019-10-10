<template>
<div class="drop_list" style="width: 140px;">
    <div class="drop_list_label">
        <a @click="toggleFilterSelector()" class="">{{selectedFilter}}</a>
    </div>
    <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
    <div class="drop_list_layer" v-if="isOpened" style="z-index: 52">
        <div class="inner_drop_list" style="max-height:256px;">
            <ul>
                <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                <li v-for="(date, key) in initialFilterList" :key="key">
                  <a class="initial-filter-item" :class="{on: selectedIdx === key}" @click="changeFilterIdx(key)">{{date.value}}</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="initial-filter-dimmed-layer" v-if="isOpened" @click="toggleFilterSelector()"></div>
</div>
</template>
<script>
export default {
  name: 'InitialFilter',
  props: {
    type: String,
    initialFilterList: Array,
    changeInitialFilter: Function,
    initialFilterObj: Object,
    isCompleteLoad: Boolean
  },
  data () {
    return {
      isOpened: false,
      selectedIdx: 0,
      selectedFilter: ''
    }
  },
  watch: {
    selectedIdx(d) {
      this.setSelectedFilter(d)
    }
  },
  methods: {
    toggleFilterSelector() {
      this.isOpened = !this.isOpened
    },
    changeFilterIdx (idx) {
      this.selectedIdx = idx
    },
    setSelectedFilter (idx) {
      this.toggleFilterSelector()
      let code = ''
      let value = ''
      _.map(this.initialFilterList, (u, i) => {
        if (i === idx) {
          code = u.code
          value = u.value
        }
      })
      this.selectedFilter = value
      this.isOpened ? this.isOpened = false : ''
      this.changeInitialFilter(this.type, value)
    }
  },
  mounted () {
    this.changeFilterIdx(0)
    this.setSelectedFilter(0)
  }
}
</script>
<style lang="scss" scoped>
.initial-filter-dimmed-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 51;
}
.initial-filter-item {
  word-wrap: break-word !important;
  height: 100% !important;
  line-height: 1.1em !important;
  padding: 10px 16px !important;
  text-align: left !important;
}
</style>
