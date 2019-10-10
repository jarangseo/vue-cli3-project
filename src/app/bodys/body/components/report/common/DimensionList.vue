<template>
<div class="set_dimension_area">
    <div class="inner_set_dimension" style="z-index: 20;">
        <!-- [D] 최대 2줄까지만 노출, 이후 말줄임 적용 필요 -->
        <i class="fn-map-089-playlist_add_check fn-18 fn-map"></i><a @click="toggleDimensionList()" class="set_dimension"><span>By: {{selectType}}</span></a>
    </div>
    <!-- [D] 드롭 리스트 open시, display:block 로 변경 필요 (default - display:none) -->
    <div class="dimention_list_layer" style="display:block;top: 64px !important;z-index: 49;" v-if="isOpenList">
        <div class="inner_drop_list">
            <ul>
                <!-- [D] 선택된 항목의 경우, a에 on 클래스 추가 필요 -->
                <li v-for="(dimension, key) in dimensionList" :key="key">
                  <a :class="{'on': selectedIdx === key}" @click="applyDimension(key)">By: {{dimension}}</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="dimension-list-dimmed-layer" v-if="isOpenList" @click="toggleDimensionList()"></div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import * as types from '@/shared/stores/types'

export default {
  name: 'DimensionList',
  data () {
    return {
      isOpenList: false,
      isOnlyOverall: false,
      selectedIdx: -1,
      dimensionList: [],
      selectType: 'overall'
    }
  },
  props: {
    setReportType: Function,
    selectedDimension: String
  },
  watch: {
    _initReportData (d) {
    },
    _activeModal (activeModal) {
      activeModal !== this.$options.name ? this.isOpenList = false : ''
    }
  },
  computed: {
    ...mapState({
      _initReportData: state => state.report._initReportData,
      _activeModal: state => state.common._activeModal
    })
  },
  methods: {
    toggleDimensionList () {
      this.$store.commit(types.SET_ACTIVE_MODAL, this.$options.name)
      this.isOpenList = !this.isOpenList
    },
    applyDimension (idx) {
      this.selectedIdx = idx
      if (this.isOnlyOverall) {
        this.selectType = 'overall'
        this.setReportType(this.dimensionList[this.selectedIdx])
      } else {
        if (idx === 0) {
          this.selectType = 'overall'
          this.setReportType(this.dimensionList[this.selectedIdx])
        } else {
          this.selectType = this.dimensionList[this.selectedIdx]
          this.setReportType('dimension', this.dimensionList[this.selectedIdx])
        }
      }
      this.toggleDimensionList()
    },
    initDimensionList (data) {
      if (data.byDemensionObjectList.length === 0) {
        this.isOnlyOverall = true
        _.forEach(data, (val, key) => {
          if (_.startsWith(key, 'by')) {
            let value = key.split('by')[1].split('ObjectList')[0]
            this.dimensionList.push(value.toLowerCase())
          }
        })
      } else {
        this.isOnlyOverall = false
        this.dimensionList.push('overall')
        _.forEach(data.dataHandlerType.byDemensionList, (o, key) => {
          this.dimensionList.push(key)
        })
      }
      this.selectedIdx = 0
      this.$forceUpdate()
    }
  },
  mounted () {
    if (!_.isEmpty(this._initReportData)) {
      this.initDimensionList(this._initReportData)
    }
  }
}
</script>
<style lang="scss" scoped>
.dimension-list-dimmed-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
</style>
