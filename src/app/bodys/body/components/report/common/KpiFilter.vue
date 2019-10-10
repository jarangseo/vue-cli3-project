<template>
  <div class="set_layer filter kpi_select_type">
    <div class="setting_group">
      <div class="set_second">
        <div class="obj_filter_list">
          <div class="title_info">
            <strong>KPI</strong>
          </div>
          <div class="input_search">
            <div class="inner_input_search">
              <button>
                <span class="ico_secrch"></span>
              </button>
              <input
                v-model="searchKeyword"
                @input="searchKeyword = $event.target.value"
                type="text"
                placeholder="Search"
              >
            </div>
          </div>
          <div class="search_result_list">
            <ul>
              <!-- [D] 선택시 li에 on 클래스 추가 필요 -->
              <li v-if="kpiList.length === 0" style="text-align: center;color: #bdbdbd;font-size: 13px;">
                검색결과 없음
              </li>
              <li v-for="(item, index) in kpiList" :key="index" :class="{ 'on' : item.selected }">
                <a
                  href="#"
                  @click.prevent="toggleKpiItem(item)"
                  class="result_select_list"
                >{{ item.text }}</a>
              </li>
            </ul>
          </div>
          <div class="select_all">
            <!-- [D] 선택시 check_select_all에 on 클래스 추가 필요 -->
            <a
              href="#"
              @click.prevent="selectAllKpi"
              class="check_select_all"
              :class="{ 'on' : isCheckedAll }"
            >Select All</a>
          </div>
        </div>
      </div>
      <div class="set_third">
        <div class="obj_selected_filter">
          <div class="title_info">
            <strong>Selected KPI</strong>
            <span>
              Total
              <em>{{ checkedList.length }}</em>
            </span>
          </div>
          <p v-if="checkedList.length === 0" class="no_set_data">
            <span>{{dataBySelectedLang.analytics_pivotset_msg_nokpi}}</span>
          </p>
          <div v-else class="selected_filter_list">
            <ul>
              <li v-for="(item, index) in backupKpiList" :key="index">
                <template v-if="item.selected">
                  <div class="selected_filter_item">
                    <span class="selected_filter_name">{{ item.text.length > 16 ? item.text.substring(0, 15) + '...' : item.text }}</span>
                    <a href="#" @click.prevent="deleteKpiItem(item)" class="btn_delete_item">
                      <span class="blind">delete</span>
                    </a>
                  </div>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_group">
      <div class="action_btn">
        <a href="#" @click.stop.prevent="toggleKpiFilter" class="btn cancel">CANCEL</a>
        <a
          href="#"
          @click.stop.prevent="applyKpi"
          class="btn apply"
          style="margin-left: 3px;"
          :class="{ disabled: checkedList.length === 0}"
        >APPLY</a>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash"
import { mapState } from 'vuex'

export default {
  name: "KpiFilter",
  props: {
    selectedKpiList: {
      type: Array,
      default: () => {
        return []
      }
    },
    unSelectedKpiList: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedKpiListAlias: {
      type: Array,
      default: () => {
        return []
      }
    },
    unSelectedKpiListAlias: {
      type: Array,
      default: () => {
        return []
      }
    },
    toggleKpiFilter: Function,
    kpiLayerData: Function
  },
  data() {
    return {
      searchKeyword: "",
      kpiList: [],
      backupKpiList: [],
      checkedList: [],
      unCheckedList: [],
      isCheckedAll: false
    }
  },
  computed: {
    ...mapState({
      dataBySelectedLang: state => state.common._lang.dataBySelectedLang
    })
  },
  watch: {
    searchKeyword (d) {
      let keyword = d
      this.kpiList = _.cloneDeep(
        this.backupKpiList.filter(item => {
          return _.toLower(item.text).indexOf(_.toLower(keyword)) > -1
        })
      )
      if (
        this.kpiList.length > 0 &&
        this.kpiList.length ===
          _.filter(this.kpiList, { selected: true }).length
      ) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
      }
    }
  },
  methods: {
    toggleKpiItem (item) {
      item.selected = !item.selected
      const selectedList = _.filter(this.kpiList, { selected: true })

      if (
        selectedList.length > 0 &&
        selectedList.length === this.kpiList.length
      ) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
      }
      _.forEach(this.backupKpiList, e => {
        _.forEach(this.kpiList, i => {
          if (e.text === i.text) {
            e.selected = i.selected
          }
        })
      })
      this.checkedList = _.filter(this.backupKpiList, { selected: true })
      this.unCheckedList = _.filter(this.backupKpiList, { selected: false })
    },
    selectAllKpi () {
      this.isCheckedAll = !this.isCheckedAll
      _.map(this.kpiList, e => {
        e.selected = this.isCheckedAll
      })
      _.forEach(this.backupKpiList, e => {
        _.forEach(this.kpiList, i => {
          if (e.text === i.text) {
            e.selected = i.selected
          }
        })
      })
      if (this.isCheckedAll) {
        this.checkedList = _.filter(this.backupKpiList, { selected: true })
        this.unCheckedList = _.filter(this.backupKpiList, { selected: false })
      } else {
        this.checkedList = _.filter(this.backupKpiList, { selected: true })
        this.unCheckedList = _.filter(this.backupKpiList, { selected: false })
      }
    },
    deleteKpiItem (item) {
      _.find(this.backupKpiList, { text: item.text }).selected = false
      _.forEach(this.kpiList, e => {
        _.forEach(this.backupKpiList, i => {
          if (e.text === i.text) {
            e.selected = i.selected
          }
        })
      })
      const selectedList = _.filter(this.kpiList, { selected: true })

      if (
        selectedList.length > 0 &&
        selectedList.length === this.kpiList.length
      ) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
      }
      this.checkedList = _.filter(this.backupKpiList, { selected: true })
      this.unCheckedList = _.filter(this.backupKpiList, { selected: false })
    },
    applyKpi () {
      if (this.checkedList.length === 0) {
        return
      }
      this.kpiLayerData({
        checkedList: _.map(this.checkedList, "kpiName"),
        unCheckedList: _.map(this.unCheckedList, "kpiName"),
        checkedListAlias: _.map(this.checkedList, "text"),
        unCheckedListAlias: _.map(this.unCheckedList, "text")
      })
    }
  },
  created () {
    const selectedKpiList = []
    const unSelectedKpiList = []
    _.map(this.selectedKpiListAlias, (item,idx) => {
      selectedKpiList.push({
        text: item,
        selected: true,
        kpiName: this.selectedKpiList[idx]
      })
    })
    _.map(this.unSelectedKpiListAlias, (item,idx) => {
      unSelectedKpiList.push({
        text: item,
        selected: false,
        kpiName: this.unSelectedKpiList[idx]
      })
    })
    this.kpiList = _.sortBy([...selectedKpiList, ...unSelectedKpiList], "text")
    this.backupKpiList = _.cloneDeep(this.kpiList)
    this.checkedList = _.filter(this.backupKpiList, { selected: true })
    this.unCheckedList = _.filter(this.backupKpiList, { selected: false })
    if (this.kpiList.length === selectedKpiList.length) {
      this.isCheckedAll = true
    }
  }
}
</script>
<style lang="scss">
.action_btn .btn.apply.disabled {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
