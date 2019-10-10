<template>
  <!-- [D] 아이콘이 아닌 문자형 버튼일 경우, btn_group에 text 클래스 추가 필요 -->
  <div 
    class="btn_group"
    :class="{text: buttonType === 'text' ? 'text' : ''}">
    <ul>
      <li v-for="(item, index) in buttonItemList" :key="`button-${index}`" :style="`width:${width};text-align:center;`">
        <a
          class="chart_type"
          :class="{ 
            on: selectedButtonItem === item ,
            stick: 'stick' === item,
            field: 'field' === item
          }"
          @click="selectedButton(item)">
          <template v-if="buttonType === 'text'">{{ item }}</template>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CommonButtonGroup',
  props: {
    buttonType: {
      types: String,
      required: false,
      default: 'text' // text or icon
    },
    buttonItemList: {
      types: Array,
      required: false,
      default: () => {return ['iOS', 'Android']}
    },
    width: {
      type: String,
      required: false,
      default: ''
    },
    selectButtonItem: {
      type: String,
      required: false,
      default: ''
    }
  },
  watch: {
    selectedButtonItem (labelName) {
      this.$emit('changeButtonItem', labelName)
    }
  },
  data () {
    return {
      isShowDropListLayer: false,
      selectedButtonItem: this.selectButtonItem
    }
  },
  computed: {},
  created () {
    this.selectedButtonItem = this.selectButtonItem !== '' ? this.selectButtonItem : this.buttonItemList[0]
  },
  mounted () {},
  methods: {
    selectedButton (item) {
      this.selectedButtonItem = item
    }
  }
}
</script>

<style scoped>
.content .inner_content .content_section .inner_content_section .chart_grid_section .inner_chart_grid .chart_area .chart_section .chart_info_area .chart_top_info .chart_elapsed .btn_group ul li a {
  height: 24px;
}
.content .inner_content .content_section .inner_content_section .chart_grid_section .inner_chart_grid .chart_area .chart_section .chart_info_area.type_revenue .chart_top_info .chart_elapsed .btn_group.text .chart_type {
  line-height: 24px;
}
.content .inner_content .content_section .inner_content_section .chart_grid_section .inner_chart_grid .chart_area .chart_section .chart_info_area .chart_top_info .chart_elapsed .btn_group ul li a.on:after {
  height: 24px;
}
</style>
