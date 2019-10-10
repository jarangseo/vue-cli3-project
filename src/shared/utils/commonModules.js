const common = {
  config: { // 配置
  dashboardPieRingTooltipShowInterval: 36000000, // 10小时，单位MS
  heightPXPerUnit: 60, // object每个高度单位对应的像素, 用户控制object高度
  resizeResponseInterval: 100, // 窗口变化响应时间间隔，防止重复调用
  rowNumberPerRender: 50, // 每次渲染条数
  fullScreenRowNumberPerRender: 100, // 全屏情况下每次渲染条数
  preRecordsToMerge: 2, // 获取新数据时，需要合并之前记录的条数，必须大于1，否则无法合并新增加数据的表格
  buttomToGetData: 50, // 小于多少像素去取数据
  windowWidthDemarcationPoint: 1080, // 决定pc模式显示还是mobile模式显示的像素分界点
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  shortcutUnitMap: { // 日期快捷方式对应映射
  6: 'quarter',
  5: 'month',
  4: 'week',
  3: 'day',
  2: 'hour',
  1: 'minute',
  'quarter': 6,
  'month': 5,
  'week': 4,
  'day': 3,
  'hour': 2,
  'minute': 1
},
  shortcutOptions: { // 日期快捷方式选项
  'month': [{
  id: 1,
  text: 'That year'
}],
  'day': [{
  id: 2,
  text: 'Every 1st day of month (for 1yr)'
}, {
  id: 3,
  text: 'That month'
}],
  'hour': [{
  id: 4,
  text: 'The same time of recent 2 days'
}, {
  id: 5,
  text: 'The same time of the last month'
}]
},
  chartTypeMap: {
  'line': {
  'type': 'line',
  'text': 'Line',
  'imgPath': '../img/chart-type01.png'
},
  'spline': {
  'type': 'spline',
  'text': 'Spline',
  'imgPath': '../img/chart-type02.png'
},
  'area': {
  'type': 'area',
  'text': 'Area',
  'imgPath': '../img/chart-type03.png'
},
  'column': {
  'type': 'column',
  'text': 'Column',
  'imgPath': '../img/chart-type04.png'
},
  'time series': {
  'type': 'area',
  'text': 'Time Series',
  'imgPath': '../img/chart-type05.png'
},
  'stacked area': {
  'type': 'area',
  'text': 'Stacked Area',
  'imgPath': '../img/chart-type06.png'
},
  'percentage area': {
  'type': 'area',
  'text': 'Percentage Area',
  'imgPath': '../img/chart-type07.png'
},
  'stacked column': {
  'type': 'column',
  'text': 'Stacked Column',
  'imgPath': '../img/chart-type08.png'
},
  'stacked percentage column': {
  'type': 'column',
  'text': 'Stacked Percentage Column',
  'imgPath': '../img/chart-type09.png'
},
  'stacked bar': {
  'type': 'bar',
  'text': 'Stacked Bar',
  'imgPath': '../img/chart-type10.png'
},
  'pie': {
  'type': 'pie',
  'text': 'Pie',
  'imgPath': '../img/chart-type11.png'
}
},
  chartColors: ['#a2e091', '#76b0ec', '#ffbc70', '#fa90a1', '#a7a1a4', '#f09dfa', '#5ec8cc', '#bcbee2', '#b85a5a', '#ffe167', '#68b386', '#5f77b4', '#f98e5b', '#ec7e7e', '#c49687', '#b7a0ff', '#6397aa', '#726a80', '#cb9ac0', '#51e0ff'],
  chartLegendPaginationActiveColor: 'rgba(102, 102, 102, 1)',
  chartLegendPaginationInactiveColor: 'rgba(102, 102, 102, 0.5)'
},
  i18n: {
  'en': {
  'tooltip': {
  '1': 'a collection of reports that demonstrate the effectiveness of marketing as numerical estimates and figures by incorporating marketing tracking information and relevant factors into account per channel.',
  '2': "a collection of reports that suggest sales status and other relating factors such as cumulative sum of sales per day/month as well as users' first purchased products information in detail.",
  '3': 'Return Of Investment, during the marketing period + following 3 days: the ratio of total sales, during the marketing period + following 3 days to total amount invested (marketing cost).',
  '4': 'track accumulated marketing effectiveness estimates during the entire marketing period through accumulated KPI figures.',
  '5': 'confirm LTVs (Lifetime Values) of remaining users on D+1 date, of the newly registered users per service at each country.'
}
},
  'ko': {
  'tooltip': {
  '1': 'MAS (Marketing Analysis System)을 통해 마케팅 효과를 수치와 트래킹정보를 통해 채널별로 측정할 수 있습니다.',
  '2': '구매자의 서비스 내 (첫 구매 포함) 매출 현황을 확인할 수 있습니다.',
  '3': '투입한 마케팅 비용 대비 마케팅 기간과 종료 직후 3일 동안의 매출액',
  '4': '마케팅 전체 기간 동안 효과를 누적KPI 를 통해 확인할 수 있습니다.',
  '5': '신규 가입 후 D+1일 잔존이용자의 LTV를 서비스별 국가별로 확인할 수 있습니다.'
}
},
  'jp': {
  'tooltip': {
  '1': 'MAS (Marketing Analysis System)によってのマーケティングのチャンネル別効果を測定してあります',
  '2': '課金ユーザーのサービス内購買現況を確認します',
  '3': 'マーケティング期間＋直後３日の間のマーケティング費用対総売上高',
  '4': 'マーケティング全体期間の累積KPIによって確認する事が出来ます',
  '5': 'アプリ新規加入ユーザーによって、基準日＋１の残存ユーザーのLTVをサービス別、国別に確認する事が出来ます'
}
},
  'zh': {
  'tooltip': {
  '1': '',
  '2': '',
  '3': '',
  '4': '',
  '5': ''
}
}
},
  util: { // 共用方法
  promise ({
			url,
			type = 'get',
			params = {}
		}) { // 请求数据
return new Promise((reslove, reject) => {
return $.ajax({
  headers: {
  'i18n': common.util.getLocalItem('locale'),
  'Content-Type': 'application/json;charset=UTF-8'
},
  url,
  type,
  dataType: 'json',
  cache: false,
  data: $.isArray(params) ? JSON.stringify(params):($.isEmptyObject(params) ? null : JSON.stringify(params))
}).done(function (data) {
  return reslove(data)
					})
					.fail(function (jqXHR, textStatus, errorThrown) {
  let data = {}
						if (textStatus !== 'abort' && jqXHR.status == 0) { // session过期
							// window.location.reload();
  return false
						};
  try {
  data = JSON.parse(jqXHR.responseText || '{}')
						} catch (e) {

};
  return reject(data)
					})
})
},
  kpiTOClass (str) { // 过滤css
  let result = 'js-';
  for (let i in str) {
  result += str.charCodeAt(i)
};
  return result
		},
  queryURIParams (url) {
  url = url.split('+').join(' ')
			let params = {}
			let tokens
			let re = /[?&]?([^=]+)=([^&]*)/g
			while (tokens = re.exec(url)) {
  params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
			};
  return params
		},
  highlightChar (reg, str) { // 字符串高亮处理
  let result = str.replace(reg, function (a, b) {
  return `<span class='search-text'>${a}</span>`
			})
			return result
		},
  isMobile () { // 是否是移动端
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		},
  mobileWidth () { // 宽度是否为移动端限定的宽度
  let windowWidth = $(window).width()
			let ScrollBarWidth = 0
			let isScrollBar = $(document).height() > $(window).height()
			ScrollBarWidth = (browser.isSafari) ? 10:17
			windowWidth += ScrollBarWidth
			return windowWidth < common.config.windowWidthDemarcationPoint
},
  device () {
  return this.mobileWidth() ? 'mobile':'pc'
		},
  showWarningMsg (msg) {
  let $warningDialog = $('.warning-pop')
			$warningDialog.find('.warning-text').html(msg)
			$warningDialog.removeClass('hide')
		},
  initConfig (config) { // reset config
  let that = this
			let data = JSON.parse(JSON.stringify(config.table))
			let keys = Object.keys(data)
  for (let i of keys) { //
  if (config.config[i]) {
  config.config[i] = []
};
};
  setTimeout(() => {
  for (let i of keys) {
  if (config.config[i]) {
  config.config[i] = data[i]
					};
};
},0)
		},
  setLocalItem (key, value) { // 设置localStorage
  $.cookie(key, value, {path: '/' })
		},
  getLocalItem (key) { // 读取localStorage
  let result = $.cookie(key)
			return result
},
  error (text = '', title = 'Error') { // leader错误提示
  let content = `<p>${text}</p>`
			let $error = $('.error-pop')
			$error.find('.error-text').html(text)
			$error.find('.alert-title').html(title)
			$error.removeClass('hide')
		},
  checkIPFormat (ips) { // ip检查
  let result = true
			if (typeof (ips) === 'string') {
  ips = ips.split(',')
			}
  if (Array.isArray(ips)) {
  let IPReg = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])$/
				ips.forEach((ip) => {
  if (!IPReg.test(ip)) {
  result = false
					}
})
} else {
  result = false
			}
  if (!result) {
  this.error('IP Format is Incorrect.')
			}
  return result
		}
},
  methods: {
  getUser () { // 获取用户信息
return common.util.promise({
  url: '/bip/user'
})
},
  getMenu () { // 获取Menu菜单页信
  return common.util.promise({
  url: '/bip/menu/V2'
})
},
  formatConfig (d) {
  let dmDescritp = d.config.dmDescritp
			d.table = {}
			if (!d.filterPostData) {
  d.filterPostData = {}
			};
  if (d.config.col) {
  d.table.col = d.config.col
			};
  if (d.config.notDisplay) {
  d.table.notDisplay = d.config.notDisplay
			};
  if (d.config.row) {
  d.table.row = d.config.row
			};
  if (d.config.type == 'chart') {
  d.table.kpi = []
				d.config.kpiMap = {}
				$.each(d.config.chartSetting || [], function (i, item) {
  d.table.kpi.push(item.name)
  item.display = !item.hide
					d.config.kpiMap[item.name] = item
				})
			}
  if (d.config.type == 'table') {
  $.each(d.config.chartSetting || [], function (item) {
  if (!item.hide) {
  if (d.table.col) {
  d.table.col.push(item.name)
						}
} else {
  if (d.table.notDisplay) {
  d.table.notDisplay.push(item.name)
						}
}
})
}
  if (d.config.dm) {
  $.each(d.config.dm, function (key, value) {
  let isDate = dmDescritp && dmDescritp[key] && dmDescritp[key].type === 'date'
					if (isDate) {
  if (Object.keys(d.config.dm[key]).length) {
  d.filterPostData[key] = d.config.dm[key]
						}
} else {
  d.filterPostData[key] = $.map(value, function (item, i) {
  if (item.selected) {
  return item.id
							}
})
}
})
			};
},
  formatLayoutData (data) {
  let dataHandlerController = {}
			let dataHandlerConfig = {}
			let dataHandlerPageInfo = {}
			data.forEach(item => {
  item.forEach(d => {
  common.methods.formatConfig(d)
					d.class = `layout-col layout-${d.w}`
					if (d.config.type == 'dataHandler') {
  dataHandlerController = {
  filterObjects: d.config.filterObjects,
  dateObjects: d.config.dateObjects
}
  dataHandlerConfig = d.config
						dataHandlerPageInfo = d
					}
  d.dataHandlerController = dataHandlerController
					d.dataHandlerConfig = dataHandlerConfig
					d.dataHandlerPageInfo = dataHandlerPageInfo
				})
			})
			return data
		},
  setDimension ({
			menuId,
			url,
			data = {}
		}) {
  var that = this
			return new Promise(function (resolve, reject) {
  $.ajax({
  headers: {
  'i18n': common.util.getLocalItem('locale'),
  'Content-Type': 'application/json;charset=UTF-8'
},
  type: 'post',
  dataType: 'json',
  url: url + menuId,
  data: JSON.stringify(data),
  success: resolve,
  error: reject
})
})
		},
		// 千分位
  thousandsSeparator (num) {
  if (!$.isNumeric(num)) {
  return num
} else {
  let isNegative = num < 0;
  num = (num || 0).toString()
				if (isNegative) {
  num = num.substr(1)
				}
  let result = ''
				let before = num
				let after = 0
				if (num.indexOf('.') != -1) {
  let temp = num.split('.')
					before = temp[0]
					after = temp[1]
				}
  while (before.length > 3) {
  result = ',' + before.slice(-3) + result
					before = before.slice(0, before.length - 3)
				}
  if (before) {
  result = before + result
				}
  if (after) {
  result += '.' + after
				}
  if (isNegative) {
  result = '-' + result
				}
  return result
			}
},
		// 格式化显示内容
  dataDisplayFormatter (setting, data) {
  let formated = data + ''
			if (formated === 'null') {
  formated = '-'
			} else if (setting && setting.type) {
  switch (setting.type) {
  case 'DATE':
    if (setting.split === 'N' && setting.formatDateTimeInDb && setting.formatDateTime && (setting.formatDateTimeInDb != setting.formatDateTime)) {
  formated = moment(data, setting.formatDateTimeInDb).format(setting.formatDateTime)
						}
    break
					case 'STRING':
    break
					case 'NUMBER':
    formated = Number(formated)
						if (!isNaN(Number(setting.formatDecimalAccuracy))) {
  formated = formated.toFixed(Number(setting.formatDecimalAccuracy))
}
    if (setting.formatThousandsSeparator) {
  formated = this.thousandsSeparator(formated)
						}
    break
					default:
    break
				}
  if (setting.prefix) {
  formated = setting.prefix + formated
				}
  if (setting.suffix) {
  formated += setting.suffix
				}
}
  return formated
		},
		/*
			是否受datahandler影响
			objectId: object id,
			dataHandlerController: datahandler控制object的id的数组
			type：控制类型，filter / date
		*/
  isControlledByDatahandler (objectId, dataHandlerController, type) {
  let result = false
			//如果page中包含datahanlder，并且当前object包含着controller数组中
			if (!$.isEmptyObject(dataHandlerController)) {
  if (type === 'filter' && $.inArray(objectId, dataHandlerController.filterObjects) != -1) {
  result = true
				} else if (type === 'date' && $.inArray(objectId, dataHandlerController.dateObjects) != -1) {
  result = true
				}
}
  return result
		},
		// 取得指定object带有漏斗的dimesion信息
  getUnAllFilter ($dom, config) {
  let unAll = []
			if (config.config && config.config.config && config.config.config.option == 'none') {
  $.each(config.config.config.dm, function (key, item) {
  if (config.config.config.dmDescritp[key] && config.config.config.dmDescritp[key].type == 'date') { // 去掉date类型

} else{
  if (item.filter(item => item.selected).length !== item.length) {
  unAll.push(key)
}
}
})
}else {
  $dom.find('.filter-table .unAll').each(function (i, item) {
  unAll.push($(item).data('item'))
})
};
  return unAll
		},
		// 取得带漏斗的dimesion信息
  getFilteredDimensions ($dom, objectId, dataHandlerController, dataHandlerConfig, type, config) {
  let filteredDimensions = this.getUnAllFilter($dom, config)
			//如果受datahandler影响，需要合并datahandler信息
			if (this.isControlledByDatahandler(objectId, dataHandlerController, type)) {
  let $datahanlderSetting = $('.datahandler-setting+.common-setting')
				filteredDimensions = Array.from(new Set(this.getUnAllFilter($datahanlderSetting, dataHandlerConfig).concat(filteredDimensions)))
			}
  return filteredDimensions
		},
		// 导出表格
  exportTable (params, type) {
  let url = ''
			params.merged = false
			switch (type) {
  case 'csv':
    url = '/bip/report/export/csv'
					break;
  case 'split':
    url = '/bip/report/export/excel'
					break;
  case 'merge':
    params.merged = true
					url = '/bip/report/export/excel'
					break;
}
  $.exportFile({
  url,
  data: params
})
		},
		// 取得filter信息
  getFilterInfo (currentObj, customOpts, fromDataHandler) {
  let format = common.config.dateTimeFormat
			let info = {
  menuId: currentObj.$store.state.menuId,
  reportId: currentObj.$route.query.reportId,
  pageId: currentObj.$store.state.tabsId,
  objectId: currentObj.config.id,
  type: currentObj.config.config.type,
  option: currentObj.config.config.option,
  dm: currentObj.config.filterPostData,
  filteredDimensions: [],
  unit: currentObj.config.config.date.unit,
  hasStart: currentObj.config.config.date.hasStart,
  hasEnd: currentObj.config.config.date.hasEnd,
  startDate: currentObj.config.config.date.start,
  endDate: currentObj.config.config.date.end,
  dateFilterData: {},
  col: currentObj.config.table.col,
  notDisplay: currentObj.config.table.notDisplay,
  row: currentObj.config.table.row,
  kpi: currentObj.config.table.kpi,
  sourceDm: currentObj.config.config.sourceDm,
  locale: currentObj.$store.state.userInfo.locale
}
			//如果受handler影响，需合并handler信息
			if (fromDataHandler) {
  info.filteredDimensions = this.getFilteredDimensions($(currentObj.$el), currentObj.config.id, currentObj.config.dataHandlerController, currentObj.config.dataHandlerConfig, 'filter', currentObj)
			} else {
  info.filteredDimensions = this.getUnAllFilter($(currentObj.$el), currentObj)
			}
  if (info.endDate) {
  switch (info.unit) {
  case 'quarter':
  case 'month':
  case 'week':
  case 'day':
    info.endDate = moment(info.endDate, format).add(1, 'days').subtract(1, 'seconds').format(format)
						break;
  case 'hour':
  case 'minute':
    info.endDate = moment(info.endDate, format).format(format)
						break;
  default:
    info.endDate = moment(info.endDate, format).format(format)
						break;
}
}
  if (currentObj.config.dateSettingInfo) {
  info.unit = currentObj.config.dateSettingInfo.unit
				info.startDate = currentObj.config.dateSettingInfo.start
				info.endDate = currentObj.config.dateSettingInfo.end
				info.dateFilterData = currentObj.config.dateSettingInfo.dateFilterData
			}
  if (customOpts) {
  info = Object.assign(info, customOpts)
			}
  return info
		},
		// 取得日期快捷方式时间范围
		// GIA-517 所有快选的时间都基于end date去取
  getShortcutDateRange (id, endDate, min, max) {
  let dateRange = {}
			min = moment(min, common.config.dateTimeFormat).format(common.config.dateTimeFormat)
			max = moment(max, common.config.dateTimeFormat).format(common.config.dateTimeFormat)
			switch (id) {
  case 1: // 'That year'
    dateRange.unit = 'month'
					dateRange.start = moment(endDate, common.config.dateTimeFormat).year() + '-01-01 00:00:00'
					dateRange.end = moment(endDate, common.config.dateTimeFormat).endOf('month').format(common.config.dateTimeFormat)
					dateRange.dateFilterData = {
  'shortcut': ['' + id]
}
					break;
  case 2: // 'Every 1st day of month (for 1yr)'
    dateRange.unit = 'day'
					dateRange.start = moment(endDate, common.config.dateTimeFormat).subtract(12, 'months').format('YYYY-MM-DD') + ' 00:00:00'
					dateRange.end = moment(endDate, common.config.dateTimeFormat).format('YYYY-MM-DD') + ' 23:59:59'
					dateRange.dateFilterData = {
  'shortcut': ['' + id]
						// 'day': ['1'],
}
					break;
  case 3: // 'That month'
    dateRange.unit = 'day'
					dateRange.start = moment(endDate, common.config.dateTimeFormat).format('YYYY-MM') + '-01' + ' 00:00:00'
					dateRange.end = moment(endDate, common.config.dateTimeFormat).format('YYYY-MM-DD') + ' 23:59:59'
					dateRange.dateFilterData = {
  'shortcut': ['' + id]
}
					break;
  case 4: // 'The same time of recent 2 days'
    dateRange.unit = 'hour'
					dateRange.start = moment(endDate, common.config.dateTimeFormat).subtract(1, 'day').format('YYYY-MM-DD HH') + ':00:00'
					dateRange.end = moment(endDate, common.config.dateTimeFormat).format('YYYY-MM-DD HH') + ':59:59'
					dateRange.dateFilterData = {
  'shortcut': ['' + id]
}
					break;
  case 5: // 'The same time of the last month'
    dateRange.unit = 'hour'
					dateRange.start = moment(endDate, common.config.dateTimeFormat).subtract(1, 'month').format('YYYY-MM-DD HH') + ':00:00'
					dateRange.end = moment(endDate, common.config.dateTimeFormat).format('YYYY-MM-DD HH') + ':59:59'
					dateRange.dateFilterData = {
  'shortcut': ['' + id]
}
					break;
}
  if (min !== '' && max !== '') {
				// 如果设置了min时间，min在start和end之间，则用min代替start
  if (moment(min, common.config.dateTimeFormat).isAfter(dateRange.start, common.config.dateTimeFormat) && moment(min, common.config.dateTimeFormat).isBefore(dateRange.end, common.config.dateTimeFormat)) {
  dateRange.start = min
				}
				// 如果设置了max时间，max在start和end之间，则用max代替end
  if (moment(max, common.config.dateTimeFormat).isAfter(dateRange.start, common.config.dateTimeFormat) && moment(max, common.config.dateTimeFormat).isBefore(dateRange.end, common.config.dateTimeFormat)) {
  dateRange.end = max
				}
}
  return dateRange
		},
		// 添加shortcut之外的filter条件，目前只有2：'Every 1st day of month (for 1yr)'
  addShortcutParams (params) {
  if (!$.isEmptyObject(params.dateFilterData) && params.dateFilterData.shortcut && params.dateFilterData.shortcut[0] === '2') {
  params.dateFilterData.day = ['1']
			}
  return JSON.parse(JSON.stringify(params))
		},
  hideTimepickerDropdown () {
  $('.datetimepicker').hide()
		},
  hideMobileSideNav ($target) {
  let $sideNav = $target.closest('.sideNav')
			let $headerSideToggle = $target.closest('.header-side-toggle')
			if ($sideNav.length === 0 && $headerSideToggle.length === 0) {
  $('body').removeClass('sideNav-open').addClass('sideNav-close')
			}
},
  hideAllTooltips () {
			// 隐藏菜单tooltip
  let $sideNav = $('.sideNav-title-name')
			$sideNav.each(function () {
  let $this = $(this)
				$this.tooltip && $this.tooltip('hide')
			})

			// 隐藏report title tooltip
  let $reportTooltip = $('.report-tooltip')
			$reportTooltip.each(function () {
  let $this = $(this)
				$this.tooltip && $this.tooltip('hide')
			})

			// 隐藏chart类型tooltip
  let $chartTypeItem = $('.chart-type-item')
			$chartTypeItem.each(function () {
  let $this = $(this)
				$this.tooltip && $this.tooltip('hide')
			})

			// 隐藏table/pivot word tooltip
  let $wordToolTip = $('.js-word-class-for-hide')
			$wordToolTip.each(function () {
  let $this = $(this)
				$this.css({display: 'none'})
			})

			// 隐藏pivot弹出框信息tooltip
  let $pivotPopupInfo = $('.pivot-popup-info')
			$pivotPopupInfo.each(function () {
  let $this = $(this)
				$this.css({display: 'none'})
			})

			// 隐藏comment中的tooltip
  let $commetTooltip = $('.commet-tooltip')
			$commetTooltip.each(function () {
  let $this = $(this)
				$this.tooltip && $this.tooltip('hide')
			})
},
  hideDatetimepickerDropdown () {
			// date setting start date
  let $startDate = $('.date-setting-start-date')
			if ($startDate.length > 0) {
  $startDate.blur()
				$startDate.closest('.date-setting-box').datetimepicker('hide')
			}
			// date setting end date
  let $endDate = $('.date-setting-end-date')
			if ($endDate.length > 0) {
  $endDate.blur()
				$endDate.closest('.date-setting-box').datetimepicker('hide')
			}
			// dashboard filter date
  let $dashboardDate = $('.js-date-picker')
			if ($dashboardDate.length > 0) {
  $dashboardDate.blur()
				$dashboardDate.closest('.date-setting-box').datetimepicker('hide')
			}
}
}
}
export default common
