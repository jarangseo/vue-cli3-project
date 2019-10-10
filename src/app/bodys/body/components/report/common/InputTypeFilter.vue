<template>
<div class="direct_input" style="display:block">
    <div class="title_info">
        <span><strong>{{filterName}}</strong></span>
    </div>
    <div class="direct_input_add">
        <dl>
            <dt>Contains</dt>
            <dd>
                <div class="input_search list_add_type">
                    <div class="inner_input_search">
                        <input type="text" placeholder="Enter a Value" v-model="filterContent" @keydown.enter="addInList">
                        <button @click="addInList()"><span class="ico_add"></span></button>
                    </div>
                </div>
            </dd>
        </dl>
    </div>
    <div class="add_item_list">
        <ul>
            <li v-for="(item, key) in inputDataList" :key="key">
                <span>{{item}}</span>
                <a class="btn_close_item" @click="deleteInList(key)">
                    <span class="blind">delete</span>
                </a>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'InputTypeFilter',
  watch: {
    filterName (d) {
      this.inputDataList = []
      this.filterContent = ''
    },
    alreadySetFilterValue (d) {
      this.inputDataList = _.cloneDeep(d)
    }
  },
  props: {
    filterName: {
      type: String,
      default: ''
    },
    setFilterValue: Function,
    alreadySetFilterValue: Array
  },
  data () {
    return {
      inputDataList: [],
      filterContent: ''
    }
  },
  methods: {
    addInList () {
      const filterContent = _.trim(this.filterContent)
      if (filterContent.length > 0) {
        if (this.inputDataList.length === 0) {
          this.inputDataList.push(filterContent)
        } else {
          this.inputDataList[0] = filterContent
        }
        this.filterContent = ''
        this.setFilterValue(this.inputDataList, this.filterName)
      }
      this.$forceUpdate()
    },
    deleteInList (idx) {
      this.inputDataList.splice(idx, 1)
      this.setFilterValue(this.inputDataList, this.filterName)
      this.$forceUpdate()
    }
  },
  mounted () {
    this.inputDataList = _.cloneDeep(this.alreadySetFilterValue)
  }
}
</script>
