import _ from 'lodash'
import * as types from '@/shared/stores/types'
import Highcharts from 'highcharts'

Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  }
})

export const chartModule = {
  state: {
    chartLegendPaginationActiveColor: 'rgba(102, 102, 102, 1)',
    chartLegendPaginationInactiveColor: 'rgba(102, 102, 102, 0.5)',
    colorCnt: 0,
    categoryColor: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
    rankColor: ['#FAA466', '#FBAE5F', '#FBB757', '#FCC050', '#FCC949', '#FCD267', '#FCDB85', '#FCE5A4', '#FBEDC2', '#FBF7E0'],
    _lineChartDataType: {
      chart: {
        type: 'line'
      },
      colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      title: '',
      xAxis: {
        categories: []
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        }
      },
      zIndex: 9,
      legend: {
        align: 'center',
        verticalAlign: 'bottom'
      },
      series: [{
        data: []
      }]
    },
    _columnChartDataType: {
      chart: {
        type: 'column'
      },
      colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      xAxis: {
        categories: []
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        }
      },
      zIndex: 5,
      series: [{
        data: []
      }]
    },
    _stackColumnDataType: {
      chart: {
        type: 'column'
      },
      colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      title: {
        text: ''
      },
      zIndex: 5,
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        },
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          }
        }
      },
      series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
      }, {
        name: 'Jane',
        data: [2, 2, 3, 2, 1]
      }, {
        name: 'Joe',
        data: [3, 4, 4, 2, 5]
      }]
    },
    _barChartDataType: {
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: [],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' '
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        },
        bar: {
          dataLabels: {
            enabled: false
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: []
    },
    _areaDataType: {
      chart: {
        type: 'area'
      },
      zIndex: 5,
      colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      xAxis: {
        allowDecimals: false,
        labels: {
          formatter: function () {
            return this.value
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          formatter () {
            return this.value
          }
        }
      },
      tooltip: {
        pointFormat: ''
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        },
        area: {}
      },
      series: [{
        // 1
      }, {
        // 2
      }]
    },
    _pieDataType: {
      chart: {
        type: 'pie'
      },
      xAxis: {
        categories: []
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: '',
        colorByPoint: true,
        data: []
      }]
    },
    _gaugeDataType: {
      chart: {
        type: 'solidgauge'
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },
      colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      pane: {
        // center: ['50%', '50%'],
        // size: '100%',
        startAngle: 0,
        endAngle: 360,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      // tooltip: {
      //   enabled: true
      // },
      // the value axis
      // yAxis: {
      //   stops: [
      //     [0.1, '#55BF3B'], // green
      //     [0.5, '#DDDF0D'], // yellow
      //     [0.9, '#DF5353'] // red
      //   ],
      //   lineWidth: 0,
      //   minorTickInterval: null,
      //   tickAmount: 2,
      //   title: {
      //     y: -70
      //   },
      //   labels: {
      //     y: 16
      //   }
      // },
      // _defaultChartType: {
      //   xAxis: {
      //     categories: []
      //   },
      //   colors: ['#6FC765', '#52AFFF', '#BE62E7', '#F093B4', '#FAA466', '#A8DA6A', '#76D8E5', '#F46C7C', '#CD9059', '#FCC949'],
      //   labels: {
      //     items: [{
      //       html: 'Total fruit consumption',
      //       style: {
      //         left: '50px',
      //         top: '18px',
      //         color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
      //       }
      //     }]
      //   },
      //   series: []
      // },
      plotOptions: {
        solidgauge: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            y: 5,
            borderWidth: 0,
            useHTML: true
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: false,
          showInLegend: true
        }
      },
      series: []
    },
    _treemapDataType: {
      series: [
        {
          type: 'treemap',
          layoutAlgorithm: 'sliceAndDice', // "sliceAndDice", "stripes", "squarified", "strip"
          alternateStartingDirection: true,
          animation: false,
          dataLabels: {
            enabled: true,
            align: 'center',
            verticalAlign: 'middle',
            style: {
              fontFamily: 'Roboto',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
              borderColor: '#ffffff',
              textOutline: ''
            }
          },
          levels: [
            {
              level: 1,
              layoutStartingDirection: 'vertical',
              layoutAlgorithm: 'sliceAndDice'
            }, {
              level: 2,
              layoutStartingDirection: 'vertical', // "vertical", "horizontal"
              layoutAlgorithm: 'sliceAndDice'
            }
          ],
          data: []
        }],
      title: {
        text: ''
      }
    }
  },
  mutations: {
    [types.INIT_COLOR_CNT] (state) {
      state.colorCnt = 0
    }
  },
  actions: {
    [types.MAKE_LINE_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let lineSeries = []
      return new Promise(resolve => {
        let lineChartData = Object.assign({}, _.cloneDeep(this.state.chart._lineChartDataType))
        let isShowRightAxis = false
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, (u, i) => {
          lineSeries.push({
            name: u.kpi.aliasDisplayName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'line',
            zIndex: 9,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            currencyUnit: chartData.currencyUnit ? chartData.currencyUnit : null,
            total: chartData.totalData ? chartData.totalData : null,
            yAxis: u.yAxis
          })
          if (dataList[i].yAxis) {
            lineSeries[lineSeries.length - 1].yAxis = dataList[i].yAxis
          }
          this.state.chart.colorCnt += 1
        })

        _.map(chartData.kpiExpression, (kpi, i) => {
          if (kpi.axisUsed) {
            isShowRightAxis = true
          }
        })
        if (isShowRightAxis) {
          if (typeName === types.DASHBOARD) {
            lineChartData['yAxis'] = [
              {
                labels: {
                  format: '{value}'
                }
              }
            ]
          } else {
            lineChartData['yAxis'] = [
              {
                labels: {
                  format: '{value}'
                }
              },
              {
                labels: {
                  format: '{value}'
                },
                opposite: true
              }
            ]
          }
        }
        lineChartData.series = lineSeries
        lineChartData.xAxis.categories = chartData.xAxisList
        this.state.chart.colorCnt += 1
        resolve(lineChartData)
      })
    },
    [types.MAKE_BAR_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let barSeries = []
      return new Promise(resolve => {
        let barChartData = Object.assign({}, _.cloneDeep(this.state.chart._barChartDataType))
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, (u, i) => {
          barSeries.push({
            name: u.kpi.aliasDisplayName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'bar',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            yAxis: u.yAxis
          })
          if (dataList[i].yAxis) {
            barSeries[barSeries.length - 1].yAxis = dataList[i].yAxis
          }
          this.state.chart.colorCnt += 1
        })
        barChartData.series = barSeries
        barChartData.xAxis.categories = chartData.xAxisList
        resolve(barChartData)
      })
    },
    [types.MAKE_STACKED_BAR_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let barSeries = []
      return new Promise(resolve => {
        let barChartData = Object.assign({}, _.cloneDeep(this.state.chart._barChartDataType))
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, (u, i) => {
          barSeries.push({
            name: u.kpi.aliasDisplayName,
            stack: u.kpi.kpiName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'bar',
            stacking: 'bar',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            yAxis: u.yAxis
          })
          if (dataList[i].yAxis) {
            barSeries[barSeries.length - 1].yAxis = dataList[i].yAxis
          }
          this.state.chart.colorCnt += 1
        })
        barChartData.series = barSeries
        barChartData.xAxis.categories = chartData.xAxisList
        resolve(barChartData)
      })
    },
    [types.MAKE_COLUMN_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let columnSeries = []
      return new Promise(resolve => {
        let columnChartData = Object.assign({}, this.state.chart._columnChartDataType)
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, (u, i) => {
          columnSeries.push({
            name: u.kpi.aliasDisplayName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'column',
            zIndex: 5,
            currencyUnit: chartData.currencyUnit ? chartData.currencyUnit : null,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            yAxis: u.yAxis,
            rate: typeName === 'DASHBOARD_OBJ_O3_SERIES' && chartData.rateData ? chartData.rateData[i] : []
          })
          if (dataList[i].yAxis) {
            columnSeries[columnSeries.length - 1].yAxis = dataList[i].yAxis
          }
          this.state.chart.colorCnt += 1
        })
        columnChartData.series = columnSeries
        columnChartData.xAxis.categories = chartData.xAxisList
        resolve(columnChartData)
      })
    },
    [types.MAKE_STACKED_COLUMN_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let columnSeries = []
      return new Promise(resolve => {
        let columnChartData = Object.assign({}, this.state.chart._columnChartDataType)
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, u => {
          columnSeries.push({
            name: u.kpi.aliasDisplayName,
            // stack: u.kpi.kpiName, // [OGPQA-1853] delete stack param
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'column',
            stacking: 'column',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            yAxis: u.yAxis
          })
          this.state.chart.colorCnt += 1
        })
        columnChartData.series = columnSeries
        columnChartData.xAxis.categories = chartData.xAxisList
        resolve(columnChartData)
      })
    },
    [types.MAKE_AREA_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let areaSeries = []
      return new Promise(resolve => {
        let areaData = Object.assign({}, this.state.chart._areaDataType)
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, u => {
          areaSeries.push({
            name: u.kpi.aliasDisplayName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'area',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            yAxis: u.yAxis
          })
          this.state.chart.colorCnt += 1
        })
        areaData.series = areaSeries
        areaData.xAxis.categories = chartData.xAxisList
        resolve(areaData)
      })
    },
    [types.MAKE_PIE_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      cnt,
      isSecond,
      chartLength
    }) {
      let pieSeries = [{
        name: '',
        data: []
      }]
      let datas = []
      let ratios = []
      let sumOfDatas = 0
      let kpis = []
      let xAxis = []
      return new Promise(resolve => {
        let pieData = Object.assign({}, _.cloneDeep(this.state.chart._pieDataType))
        xAxis = chartData.xAxisList
        _.forEach(chartData.chartDataList, u => {
          datas = _.cloneDeep(u.dataList)
          kpis.push(u.kpi.aliasDisplayName)
        })
        _.map(datas, o => {
          sumOfDatas += o
        })
        ratios = _.map(datas, o => {
          return _.floor(o / sumOfDatas, 2)
        })
        pieSeries = [{
          type: 'pie',
          showInLegend: true,
          name: kpis[0],
          colorByPoint: true,
          center: cnt === undefined || cnt === 0 ? ['50%', '50%']
                  // 아래에 간소화식 적용: (100 * (cnt + 1) / (chartLength)) - (100 / (chartLength * 2))
                  : chartLength ? [`${(100 * cnt + 50) / chartLength}%`, 80]
                  : [(cnt + 1) * 300, 80],
          size: 190,
          data: _.map(ratios, (o, i) => {
            return {
              name: (_.isEqual(xAxis, [''])) ? kpis[0] : ((typeName === types.DASHBOARD) ? xAxis[i] : xAxis[i] + ',' + kpis[0]),
              y: datas[i],
              v: chartData.chartDataList[0].dataList[i],
              currencyUnit: chartData.currencyUnit ? chartData.currencyUnit : null,
              sliced: false,
              selected: false
            }
          }),
          dataLabels: {
            enabled: false
          }
        }]
        pieData.plotOptions.pie.borderColor = sumOfDatas > 0 ? '#ffffff' : '#000000'
        pieData.series = pieSeries
        resolve(pieData)
      })
    },
    [types.MAKE_TREEMAP_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let treemapSeries = []
      return new Promise(resolve => {
        let treemapData = Object.assign({}, _.cloneDeep(this.state.chart._treemapDataType))
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        // treemapSeries.push(chartData.chartAreaList)
        if (_.isArray(chartData.chartAreaList)) {
          chartData.chartAreaList.forEach(item => {
            treemapSeries.push(item)
          })
          _.map(dataList, u => {
            treemapSeries.push({
              name: u.kpi.aliasDisplayName,
              value: _.map(u.dataList, o => {
                return o
              })[0],
              parent: u.parent
              // type: 'treemap',
              // zIndex: 5,
              // color: this.state.chart.categoryColor[this.state.chart.colorCnt]
            })
            this.state.chart.colorCnt += 1
          })
          treemapData.series[0].data = treemapSeries
          // treemapData.xAxis.categories = chartData.xAxisList
        }
        resolve(treemapData)
      })
    },
    [types.MAKE_GAUGE_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let gaugeSeries = []
      let gaugePane = {
        startAngle: 0,
        endAngle: 360,
        background: []
      }
      return new Promise(resolve => {
        let gaugeData = Object.assign({}, _.cloneDeep(this.state.chart._gaugeDataType))
        let radiusModel = { outer: 23, inner: 35 }
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        const radiusGap = 80
        const radiusGapCount = radiusGap / (dataList.length - 1)
        const paneBackgroundBorderWidth = 0
        const paneBackgroundColor = '#eeeeee'
        const dataSumNumber = _.sum(dataList.map(item => item.dataList[0]))
        _.map(dataList, (u, i) => {
          gaugeSeries.push({
            name: u.kpi.aliasDisplayName,
            data: [{
              color: this.state.chart.categoryColor[this.state.chart.colorCnt],
              radius: `${radiusModel.outer}%`,
              innerRadius: `${radiusModel.inner}%`,
              y: _.map(u.dataList, o => {
                return _.round(o / 3600, 2) || 0
              })[0],
              percent: _.round((u.dataList[0] ? u.dataList[0] : 0) * 100 / dataSumNumber, 2)
            }],
            type: 'solidgauge',
            showInLegend: true,
            colorByPoint: false
            // marker: {
            //   lineColor: this.state.chart.categoryColor[index],
            //   fillColor: this.state.chart.categoryColor[index]
            // }
          })

          gaugePane.background.push({
            outerRadius: `${radiusModel.outer}%`,
            innerRadius: `${radiusModel.inner}%`,
            backgroundColor: paneBackgroundColor,
            borderWidth: paneBackgroundBorderWidth
          })
          radiusModel.outer += radiusGapCount
          radiusModel.inner += radiusGapCount

          this.state.chart.colorCnt += 1
        })
        gaugeData.series = gaugeSeries
        gaugeData.yAxis.max = _.round(_.max(dataList.map(item => item.dataList[0])) / 3600, 2)
        gaugeData.pane = gaugePane
        resolve(gaugeData)
      })
    },
    [types.MAKE_STACKED_PERCENTAGE_BAR_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let barSeries = []
      return new Promise(resolve => {
        let barChartData = Object.assign({}, _.cloneDeep(this.state.chart._barChartDataType))
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        chartData.xAxisList.forEach(item => {
          barChartData.xAxis.categories.push(item)
        })
        _.map(dataList, (u, i) => {
          barSeries.push({
            // name: 'test',
            stack: 'test',
            name: u.kpi.aliasDisplayName,
            // stack: u.kpi.kpiName,
            data: _.map(u.dataList, o => {
              return o
            }),
            type: 'bar',
            stacking: 'percent',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt]
          })
          this.state.chart.colorCnt += 1
        })
        barChartData.series = barSeries
        resolve(barChartData)
      })
    },
    [types.MAKE_STACKED_PERCENTAGE_COLUMN_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let columnSeries = []
      return new Promise(resolve => {
        let columnChartData = Object.assign({}, _.cloneDeep(this.state.chart._columnChartDataType))
        chartData.xAxisList.forEach(item => {
          columnChartData.xAxis.categories.push(item)
        })
        _.map(chartData.chartDataRateList, (u, i) => {
          columnSeries.push({
            name: u.kpi.aliasDisplayName,
            // stack: u.kpi.kpiName,
            stack: 'test',
            data: _.map(u.dataList, o => {
              return o
            }),
            value: chartData.chartDataList[i].dataList[0] || 0,
            type: 'column',
            stacking: 'percent',
            zIndex: 5,
            color: this.state.chart.categoryColor[this.state.chart.colorCnt]
          })
          this.state.chart.colorCnt += 1
        })
        columnChartData.series = columnSeries
        resolve(columnChartData)
      })
    },
    [types.MAKE_GROUP_BAR_CHART] ({
      commit
    }, {
      chartData,
      typeName,
      isSecond
    }) {
      let barSeries = []
      return new Promise(resolve => {
        let barChartData = Object.assign({}, _.cloneDeep(this.state.chart._barChartDataType))
        let dataList = isSecond ? chartData.secondChartDataList : chartData.chartDataList
        _.map(dataList, u => {
          barSeries.push({
            // type: 'bar',
            name: u.kpi.aliasDisplayName,
            y: _.map(u.dataList, o => {
              return o
            })[0],
            color: this.state.chart.categoryColor[this.state.chart.colorCnt],
            // zIndex: 5,
            dataLabels: {color: this.state.chart.categoryColor[this.state.chart.colorCnt]}
          })
          this.state.chart.colorCnt += 1
        })
        barChartData.series = [{
          type: 'bar',
          data: barSeries
        }]
        barChartData.xAxis.categories = chartData.xAxisList
        resolve(barChartData)
      })
    }

  }
}
