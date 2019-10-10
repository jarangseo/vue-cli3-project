<template>
<div class="set_layer filter" style="display:block;width: 767px !important;" v-if="isOpenFilterEditor">
    <div class="setting_group">
        <div class="set_first">
            <div class="obj_dimension_list">
                <ul>
                    <!-- [D] 선택시 li에 on 클래스 추가 필요 -->
                    <!-- [D] dimension에 필터가 걸려있을 경우, dimension_item에 in_filter 클래스 추가 필요 -->
                    <li :class="{'on selected': currentActiveFilterIdx === key}" v-for="(filter, key) in filterList" :key="key">
                      <a @click="selectFilter(filter, key)" class="dimension_item" :class="{'in_filter': _.filter(selectedFilters, o => { return o.name === filter}).length > 0}">
                        <span>{{filter}}</span>
                      </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="set_second">
            <!-- [D] 선택한 Dimention이 없을 경우 아래 구조 노출 -->
            <p class="no_set_data" style="display:block;" v-if="filterList.length === 0"><span>선택한 Dimension이 없습니다.</span></p>
            <!-- [D] 선택한 Dimention이 있을 경우 아래 구조 노출 -->
            <search-type-filter
              v-if="isSearchFilter"
              :filterCodeList="currentActiveFilter"
              :filterName="filterList[currentActiveFilterIdx]"
              :setFilterValue="setFilterValue"
              :searchFilterCodeList="searchFilterCodeList"
              :alreadySetFilterValues="getAlreadySetFilterValues(filterList[currentActiveFilterIdx])"
            ></search-type-filter>
            <!-- [D] 상세리스트 직접 입력할 경우 아래 구조 노출 -->
            <input-type-filter
              v-if="!isSearchFilter"
              :filterName="filterList[currentActiveFilterIdx]"
              :setFilterValue="setInputFilterValue"
              :alreadySetFilterValue="getAlreadySetFilterValues(filterList[currentActiveFilterIdx])"
            >
            </input-type-filter>
        </div>
        <div class="set_third" style="width: 239px !important;"  v-if="filterList.length > 0">
            <div class="obj_selected_filter">
                <div class="title_info">
                    <strong>Selected Filter</strong><span>Total<em>{{ selectedFilters.length }}</em></span>
                </div>
                <!-- [D] 선택한 Dimention이 없을 경우 아래 구조 노출 -->
                <p class="no_set_data" style="display:block;margin-left: 0 !important;" v-if="selectedFilters.length === 0"><span>{{dataBySelectedLang.analytics_handler_msg_nofilter}}</span></p>
                <div class="selected_filter_list" v-else>
                    <ul>
                        <li v-for="(filter, key) in selectedFilters" :key="key">
                            <div class="selected_filter_item">
                                <span class="selected_filter_name" style="width:100%;overflow: hidden;text-overflow:ellipsis;">{{filter.name}}</span>
                                <p class="selected_filter_info" style="width:100%;word-break:break-all;">{{ _.map(filter.filterValues, o => { return typeof o === 'string' ? o : o.value }).toString() }}</p>
                                <a class="btn_delete_item" @click="deleteInSelectedFilters(key)"><span class="blind">delete</span></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="btn_group">
        <a class="btn_clear" @click="clearFilter()">Clear</a>
        <div class="action_btn">
            <a class="btn cancel" @click="toggleFilterEditor()">CANCEL</a>
            <a class="btn apply" @click="applyFilter(selectedFilters)">APPLY</a>
        </div>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import SearchTypeFilter from './SearchTypeFilter.vue'
import InputTypeFilter from './InputTypeFilter.vue'
import _ from 'lodash'

export default {
  name: 'FilterEditor',
  components: {
    SearchTypeFilter,
    InputTypeFilter
  },
  props: {
    isOpenFilterEditor: Boolean,
    toggleFilterEditor: Function,
    applyFilter: Function,
    alreadySetFilter: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentActiveFilterName: String,
    type: {
      type: String,
      default: ''
    },
    pivotFilterList: Object,
    parent: {
      type: String,
      default: 'setting'
    }
  },
  watch: {
    _initReportData (d) {
      this.filterList = []
      if (this.type && this.type === 'pivotSetting') {
        _.forEach(this.pivotFilterList, (val, key) => {
          this.filterList.push(key)
          this.$forceUpdate()
        })
      } else {
        _.forEach(d.dataHandlerType.filterList, (val, key) => {
          this.filterList.push(key)
          this.$forceUpdate()
        })
      }
    },
    isOpenFilterEditor (isOpen) {
      if (isOpen) {
        this.selectedFilters = _.cloneDeep(this.alreadySetFilter)
        this.selectFilter(this.filterList[0], 0)
        this.$forceUpdate()
      } else {
        this.currentActiveFilter = {}
        this.currentActiveFilterIdx = -1
      }
    },
    currentActiveFilterName (d) {
      const idx = _.indexOf(this.filterList, d)
      if (idx > -1) {
        this.selectFilter(this.filterList[idx], idx)
      }
    },
    pivotFilterList (d) {
      if (this.type && this.type === 'pivotSetting') {
        this.filterList = []
        _.forEach(d, (val, key) => {
          this.filterList.push(key)
          this.$forceUpdate()
        })
      }
    }
  },
  data () {
    return {
      filterList: [],
      selectedFilters: [],
      currentActiveFilter: {},
      currentActiveFilterIdx: 0,
      currentSelectFieldIdx: -1,
      filterValues: [],
      backupAllCurrentActiveFilterList: [],
      isSearchFilter: false
    }
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData,
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang
    }),
    _ () {
      return _
    }
  },
  methods: {
    clearFilter () {
      this.selectedFilters = []
      this.applyFilter([])
      this.$forceUpdate()
    },
    searchFilterCodeList (keyword) {
      if (keyword !== '') {
        this.currentActiveFilter = this.backupAllCurrentActiveFilterList.filter(o => {
          return _.toLower(o.value).indexOf(_.toLower(keyword)) > -1
        })
      } else {
        this.currentActiveFilter = this.backupAllCurrentActiveFilterList
      }
    },
    selectFilter (filter, key) {
      let filterVal = this._initReportData.dataHandlerType.filterList[filter]
      if (this.type && this.type === 'pivotSetting') {
        filterVal = this.pivotFilterList[filter]
      }
      this.currentActiveFilter = _.cloneDeep(filterVal)
      this.backupAllCurrentActiveFilterList = _.cloneDeep(filterVal)
      this.currentActiveFilterIdx = key
      this.isSearchFilter = this.currentActiveFilter && this.currentActiveFilter[0].code
    },
    setFilterValue (array, filterName) {
      let filterIdx = -1
      _.map(this.selectedFilters, (u, i) => {
        if (u.name === filterName) {
          filterIdx = i
        }
      })
      if (array.length > 0 && filterIdx === -1) {
        this.selectedFilters.push({
          name: filterName,
          filterValues: array
        })
      } else if (array.length > 0 && filterIdx > -1) {
        this.selectedFilters[filterIdx].filterValues = array
      } else if (array.length === 0 && filterIdx > -1) {
        this.selectedFilters.splice(filterIdx, 1)
      }
    },
    setInputFilterValue (array, filterName) {
      let filterIdx = -1
      _.map(this.selectedFilters, (u, i) => {
        if (u.name === filterName) {
          filterIdx = i
        }
      })
      if (array.length > 0 && filterIdx === -1) {
        this.selectedFilters.push({
          name: filterName,
          filterValues: _.cloneDeep(array)
        })
      } else if (array.length > 0 && filterIdx > -1) {
        this.selectedFilters[filterIdx].filterValues = _.cloneDeep(array)
      } else if (array.length === 0 && filterIdx > -1) {
        this.selectedFilters.splice(filterIdx, 1)
      }
      this.currentSelectFieldIdx = filterIdx === -1 ? this.selectedFilters.length - 1 : filterIdx
    },
    getAlreadySetFilterValues (filterName) {
      let filterIdx = -1
      _.map(this.selectedFilters, (u, i) => {
        if (u.name === filterName) {
          filterIdx = i
        }
      })
      return this.selectedFilters[filterIdx] ? _.cloneDeep(this.selectedFilters[filterIdx].filterValues) : []
    },
    deleteInSelectedFilters (idx) {
      this.selectedFilters.splice(idx, 1)
    }
  },
  mounted () {
    if (this.type && this.type === 'pivotSetting') {
      _.forEach(this.pivotFilterList, (o, key) => {
        this.filterList.push(key)
      })
    } else {
      _.forEach(this._initReportData.dataHandlerType.filterList, (o, key) => {
        this.filterList.push(key)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.obj_dimension_list {
 li.selected {
   background-color: #f2faf1;
 }
}
</style>
