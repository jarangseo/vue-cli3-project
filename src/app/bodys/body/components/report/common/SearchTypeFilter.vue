<template>
<div class="obj_filter_list">
    <div class="title_info">
        <strong>{{filterName}}</strong><span><em>{{selectedItemList.length}}</em>/{{filterCodeList.length}}</span>
    </div>
    <div class="input_search">
        <div class="inner_input_search">
            <button><span class="ico_secrch"></span></button>
            <input type="text" placeholder="Search" v-model="searchValue">
        </div>
    </div>
    <div class="search_result_list">
        <ul>
            <!-- [D] 선택시 li에 on 클래스 추가 필요 -->
            <li v-for="(filter, key) in codeList" :key="filter.value + '_' + key" :class="{on: selectedItemList.filter(o => { return o.value === filter.value }).length > 0}">
              <a @click="selectFilterCode(filter)" class="result_select_list">{{filter.value}}</a>
            </li>
            <li v-if="filterCodeList.length === 0" style="text-align: center;color: #bdbdbd;font-size: 13px;">검색결과 없음</li>
            <!-- <li class="on"><a class="result_select_list">Korea</a></li> -->
        </ul>
    </div>
</div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'SearchTypeFilter',
  props: {
    filterCodeList: {
      type: Array,
      default: () => { return [] }
    },
    filterName: {
      type: String,
      default: ''
    },
    setFilterValue: Function,
    alreadySetFilterValues: {
      type: Array,
      default: () => { return [] }
    },
    searchFilterCodeList: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    filterCodeList (d) {
      this.codeList = _.cloneDeep(d)
    },
    filterName (d) {
      this.selectedItemList = _.cloneDeep(this.alreadySetFilterValues)
    },
    alreadySetFilterValues (d) {
      this.selectedItemList = _.cloneDeep(d)
    },
    searchValue (d) {
      this.searchFilterCodeList(d)
    }
  },
  data () {
    return {
      selectedItemList: [],
      searchValue: '',
      codeList: []
    }
  },
  methods: {
    selectFilterCode (filter) {
      let isAlreadyIn = this.selectedItemList.filter(o => { return o.value === filter.value }).length > 0
      let isAlreadyInListIdx = -1
      _.map(this.selectedItemList, (u, i) => {
        if (u.value === filter.value) {
          isAlreadyInListIdx = i
        }
      })
      if (isAlreadyIn) {
        this.selectedItemList.splice(isAlreadyInListIdx, 1)
      } else {
        this.selectedItemList.push(filter)
      }
      this.setFilterValue(this.selectedItemList, this.filterName)
    }
  },
  mounted () {
    _.forEach(this.alreadySetFilterValues, o => {
      this.selectedItemList.push(o)
    })
    if (this.filterCodeList.length > 0) {
      this.codeList = _.cloneDeep(this.filterCodeList)
    }
  }
}
</script>
