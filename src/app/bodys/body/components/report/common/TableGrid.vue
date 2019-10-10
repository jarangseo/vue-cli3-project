<template>
  <div class="fixedTable add_header_type">
    <div class="fake-header">
        <table class="table table-bordered _fake">
            <tbody>
                <tr v-for="(column, key) in columnList" :key="key" :class="{merged: key > 0}">
                    <td :colspan="columnList.length" :rowspan="columnList.length" v-if="key === 0" class="bg_img_input2"></td>
                    <td class="col-title">{{column}}</td>
                </tr>
                <tr>
                    <td v-for="(row, key) in rowList" :key="key" :rowspan="spanSize(cols, key, 0, 'columnHeaders')"><a  class="btn_sort">{{row}}</a></td>
                </tr>
            </tbody>
        </table>
    </div>
    <header class="fixedTable-header">
        <table class="table table-borderd _header" style="margin-left: 0px;">
            <colgroup>
                <col v-for="(column, idx) in cols" :key="idx" width="142">
            </colgroup>
            <tbody>
                <tr v-for="(colField, colFieldIndex) in colFields" :key="colField.key" v-if="colField.showHeader === undefined || colField.showHeader">
                  <th v-for="(col, colIndex) in cols" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFieldIndex, colIndex, 'columnHeaders')" v-if="spanSize(cols, colFieldIndex, colIndex, 'columnHeaders') !== 0">
                    <template>
                      <div>
                        {{ col[colFieldIndex] }}
                      </div>
                    </template>
                  </th>
                </tr>
            </tbody>
        </table>
    </header>
    <aside class="fixedTable-sidebar">
      <table class="table table-bordered" style="margin-top: 0px;">
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="JSON.stringify(row)">
            <th
              class="row-name"
              v-for="(rowField, rowFieldIndex) in rowFields" :key="rowField.key" :rowspan="spanSize(rows, rowFieldIndex, rowIndex, 'rowHeaders')"
              v-if="(rowField.showHeader === undefined || rowField.showHeader) && spanSize(rows, rowFieldIndex, rowIndex, 'rowHeaders') !== 0"
            >
              <template>
                {{ row[rowFieldIndex] }}
              </template>
            </th>
            </tr>
        </tbody>
      </table>
    </aside>
    <div class="fixedTable-body">
        <table class="table table-bordered">
            <colgroup>
                <col v-for="(column, idx) in cols" :key="idx" width="142">
            </colgroup>
            <tbody>
                <tr v-for="(row) in rows" :key="JSON.stringify(row)">
                    <td v-for="col in cols" :key="JSON.stringify(col)" class="text-right">
                      <slot v-if="$scopedSlots.value" name="value" v-bind:value="values[JSON.stringify({ col, row })]" />
                      <template v-else>{{ values[JSON.stringify({ col, row })] }}</template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>
<script>
/* eslint no-unmodified-loop-condition: "off" */
// vue-pivot-table forked url : https://github.com/AlbertBae/vue-pivot-table.git
import naturalSort from 'javascript-natural-sort'
export default {
  name: 'TableGrid',
  props: {
    data: {
      type: Array,
      default: () => { return [] }
    },
    rowFields: {
      type: Array,
      default: () => { return [] }
    },
    colFields: {
      type: Array,
      default: () => { return [] }
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    noDataWarningText: {
      type: String,
      default: 'No data to display.'
    },
    columnList: {
      type: Array,
      default: () => { return [] }
    },
    rowList: {
      type: Array,
      default: () => { return [] }
    },
    isDataLoading: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      values: {} // Alas vue does not support js Map
    }
  },
  watch: {
    colsAndRows: function () {
      this.computeValues()
    }
  },
  computed: {
    cols: function () {
      const cols = []

      const extractColsRecursive = (depth, filters) => {
        const getter = this.colFields[depth].getter
        const sort = this.colFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ data: this.data, colFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.colFields.length) {
            extractColsRecursive(depth + 1, valueFilters)
          } else {
            cols.push(valueFilters)
          }
        })
      }

      if (this.colFields.length > 0) {
        extractColsRecursive(0, {})
      } else {
        cols.push({})
      }

      return cols
    },
    rows: function () {
      const rows = []
      const extractRowsRecursive = (depth, filters) => {
        const getter = this.rowFields[depth].getter
        const sort = this.rowFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ data: this.data, rowFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.rowFields.length) {
            extractRowsRecursive(depth + 1, valueFilters)
          } else {
            rows.push(valueFilters)
          }
        })
      }

      if (this.rowFields.length > 0) {
        extractRowsRecursive(0, {})
      } else {
        rows.push({})
      }
      return rows
    },
    // Compound property for watch single callback
    colsAndRows: function () {
      return [this.cols, this.rows]
    },
    // Reversed props for footer iterators
    colFieldsReverse: function () {
      return this.colFields.slice().reverse()
    },
    rowFieldsReverse: function () {
      return this.rowFields.slice().reverse()
    },
    // Number of col header rows
    colHeaderSize: function () {
      return this.colFields.filter(colField => colField.showHeader === undefined || colField.showHeader).length
    },
    // Number of col footer rows
    colFooterSize: function () {
      return this.colFields.filter(colField => colField.showFooter).length
    },
    // Number of row header columns
    rowHeaderSize: function () {
      return this.rowFields.filter(rowField => rowField.showHeader === undefined || rowField.showHeader).length
    },
    // Number of row footer columns
    rowFooterSize: function () {
      return this.rowFields.filter(rowField => rowField.showFooter).length
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex: function () {
      return this.colFields.findIndex(colField => colField.showHeader === undefined || colField.showHeader)
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex: function () {
      return this.colFieldsReverse.findIndex(colField => colField.showFooter)
    }
  },
  methods: {
    // Get data filtered
    filteredData: function ({ data = [], colFilters = {}, rowFilters = {} }) {
      // Prepare getters
      const colGetters = {}
      const rowGetters = {}

      for (const depth in colFilters) {
        colGetters[depth] = this.colFields[depth].getter
      }

      for (const depth in rowFilters) {
        rowGetters[depth] = this.rowFields[depth].getter
      }
      // Filter data with getters
      return data.filter(item => {
        let keep = true

        for (const depth in colFilters) {
          if (colGetters[depth](item) !== colFilters[depth]) {
            keep = false
            break
          }
        }

        if (keep) {
          for (const depth in rowFilters) {
            if (rowGetters[depth](item) !== rowFilters[depth]) {
              keep = false
              break
            }
          }
        }
        return keep
      })
    },
    // Get colspan/rowspan size
    spanSize: function (values, fieldIndex, valueIndex, type) {
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][fieldIndex] === values[valueIndex][fieldIndex] &&
        (fieldIndex === 0 || (this.spanSize(values, fieldIndex - 1, valueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length && values[i + 1][fieldIndex] === values[i][fieldIndex] && (fieldIndex === 0 || (i + 1 < values.length && this.spanSize(values, fieldIndex - 1, i + 1) === 0))) {
        i++
        size++
      }
      return size
    },
    // Called when cols/rows have changed => recompute values
    computeValues: function () {
      // Remove old values
      this.values = {}

      // Compute new values
      this.rows.forEach(row => {
        const rowData = this.filteredData({ data: this.data, rowFilters: row })
        this.cols.forEach(col => {
          const data = this.filteredData({ data: rowData, colFilters: col })

          const key = JSON.stringify({ col, row })
          const value = data.reduce(this.reducer, 0)
          this.values[key] = value
        })
      })
    }
  },
  created: function () {
    this.computeValues()
  }
}
</script>
<style lang="scss" scoped>
.row-name {
  border-left: 1px solid #e0e0e0;
}
.col-title {
  border-bottom: 1px solid #e0e0e0;
}
</style>
