<template>
<div class="drop_list" style="width: 140px;">
    <div class="drop_list_label">
        <a @click="toggleElapsedDate()" class="">D001 Retention</a>
    </div>
    <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
    <div class="drop_list_layer" v-if="isShowDrpDownList">
        <div class="inner_drop_list" style="max-height:256px;">
            <ul>
                <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                <li v-for="(date, key) in elipsedDateList" :key="key">
                  <a :class="{on: selectedIdx === key}" @click="selectElipsedDate(key)" >{{date}}</a>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: 'ElapsedDaySelector',
  props: {
    isShowDrpDownList: Boolean,
    toggleElapsedDate: Function,
    setElapsedDay: Function,
    alreadySetElapsedDate: String,
    elipsedDateList: Array
  },
  data () {
    return {
      selectedIdx: -1
    }
  },
  methods: {
    selectElipsedDate (idx) {
      this.selectedIdx = idx
      this.setElapsedDay()
    }
  }
}
</script>
