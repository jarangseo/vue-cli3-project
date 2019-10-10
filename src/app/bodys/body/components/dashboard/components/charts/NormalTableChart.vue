<template>
  <div class="grid_area">
    <div class="grid_title">
      <p>Realtime Event Count</p>
    </div>
    <!-- noraml_table -->
    <!-- 세로 스크롤 생성시 type_scroll 클래스 추가해주세요 -->
    <div class="normalTable"
      :class="options.body.data.length > 10 ? 'type_scroll' : ''"
      id="">
      <header class="normalTable-header">
        <table class="table table-borderd _header" style="margin-left: 0px;">
          <colgroup>
            <template v-for="(item, index) in options.header.rate">
              <col :width="item" :key="`normal-table-header-rate-${index}`">
            </template>
          </colgroup>
          <tbody>
            <tr>
              <th
                v-for=" (item, index) in options.header.data"
                :key="`normal-table-header-${index}`">
                <a :class="{btn_sort: isEnabledSorting(item.column)}">
                  <span @click="sortByColumn(item.column)" v-tooltip.auto="tooltip[options.header.column[index]].tooltip">{{ options.header.column[index] }}</span>
                  <!-- <span>{{ item.name }}</span> -->
                </a>
              </th>
            </tr>
          </tbody>
        </table>
      </header>

      <div class="normalTable-body">
        <table class="table table-bordered">
          <colgroup>
            <template
              v-for="(item, index) in options.body.rate">
              <col :width="item" :key="`normal-table-body-rate-${index}`">
            </template>
          </colgroup>
          <tbody>
            <tr
              v-for="(item, index) in options.body.data"
              :key="`normal-table-body-${index}`">
              <td>{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td class="align_right">{{ item[2].replace('.0', '') }}</td>
              <!-- <td>{{ item.type }}</td>
              <td>{{ item.name }}</td>
              <td class="align_right">{{ item.count }}</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- //normal_table -->
  </div>
</template>
<script>
  import * as types from '@/shared/stores/types'
  import { mapActions, mapState } from 'vuex'
  import CommonLoading from '../common/CommonLoading'
  import { dashboardMixin } from '@/shared/utils/dashboardMixin'
  export default {
    name: 'NormalTalbeChart',
    mixins: [ dashboardMixin ],
    props: {
      tableData: {
        type: Object,
        required: true,
        default: () => {return {}}
      }
    },
    components: {
    },
    data () {return {
      options: _.cloneDeep(this.tableData),
      sortOrderby: [
        // EX: {column: 'type', sort: false},
      ],
      tooltip: {
        'EventType': {},
        'EventName': {},
        'Count': {},
      },
      tooltipBase: [
        { name: 'EventType', glossaryId: 197 },
        { name: 'EventName', glossaryId: 198 },
        { name: 'Count', glossaryId: 40 },
      ]
    }},
    computed: {},
    created () {
      this.init()
    },
    methods: {
      init () {
        if (!this.sortOrderby.length) this.setSortOrderby()
        this.tooltipBase.forEach( item => {
          this.mixinGetGlossary({ids: item.glossaryId}).then( res => {
            if (!_.isEmpty(res)) {
              this.tooltip[item.name] = res[0]
            } else {
              console.log(`${this.name} / ${this.tooltipBase[this.name].glossaryId} / then res: `, res)
            }
          })
        })
      },
      setSortOrderby () {
        this.tableData.header.data.forEach( item => {
          this.sortOrderby.push({column: item.column, sort: false })
        })
      },
      isEnabledSorting (name) {
        return _.includes(_.lowerCase(name), 'count') ? false : true
      },
      sortByColumn (columnName) {
        if (this.isEnabledSorting(columnName)) {
          const tmp = _.cloneDeep(this.options.body.data)
          const sortColumn = this.sortOrderby.filter( item => item.column === columnName)[0]
          if (!sortColumn.sort) {
            this.options.body.data = _.sortBy(tmp, columnName)
            _.cloneDeep(this.sortOrderby).forEach( (item, index) => {
              this.sortOrderby[index].sort = (item.column === columnName) ? true : false
            })
          }
          this.options.body.data = tmp.reverse()
        }
      }
    }
  }
</script>
