<template>
  <div class="drop_list">
    <div class="drop_list_label">
      <a @click="toggleDropListLayerDisplay">{{ dropListLabel }}</a>
    </div>
    <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
    <div 
      v-show="isShowDropListLayer"
      class="drop_list_layer" style="display:block;">
      <div class="inner_drop_list" style="max-height:256px;">
        <ul>
          <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
          <li v-for="(item, index) in dropListOption" :key="`option-${index}`">
            <a
              :class="{ on: dropListLabel === item }"
              @click="changeDropListLabel(item, index)">{{ item }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonDropList',
  props: {
    dropListOption: {
      types: Array,
      required: true,
      default: ['1Month', '2Month', '3Month']
    }
  },
  watch: {
    dropListLabel (labelName) {
      this.$emit('dropListLabel', labelName, this.dropListIndex)
    }
  },
  data () {
    return {
      isShowDropListLayer: false,
      dropListLabel: '',
      dropListIndex: 0
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {},
  methods: {
    init() {
      this.initDropListLabel()
    },
    initDropListLabel () {
      this.dropListLabel = this.dropListOption[0]
    },
    toggleDropListLayerDisplay () {
      this.isShowDropListLayer = this.isShowDropListLayer ? false : true
    },
    changeDropListLabel (item, index) {
      this.dropListLabel = item
      this.dropListIndex = index
      this.toggleDropListLayerDisplay()
    }
  }
}
</script>
