<template>
	<div class="inner-con chart-object">
		<div class="inner-top clearfix">
			<div class="inner-title" v-show="config.config.showTitle">{{chartData.title && chartData.title.titleForFront}}</div>
			<div class="handlebar">
				<div v-if="isShowFilter && !isLoading" class="plus-btn show-setting" v-on:click='openSetting(config)'><span class="icon-handler"></span></div>
			</div>
		</div>
		<chart-setting-component v-show="chartData.series && chartData.series.length > 0&&!hasPie" :config="config" @applyChartSetting="applyChartSetting" @resetChartSetting="resetChartSetting"></chart-setting-component>
		<div class="inner-container chart-container">
			<div :class="'chart-container-'+config.id" :style="{height: containerHeight+'px'}"></div>
			<div class="chart-switch hide">
				<input type='button' v-for='item in chartKpiButtons' :class="{'kpi-button':true,'off':item.hide}" :value='item.name' />
			</div>
			<div class='loading-data' v-show='isLoading'></div>
		</div>
		<handler-component :config="config" ref="handler" @applySetting="getChartData('init')"></handler-component>
	</div>
</template>
<script type="text/javascript">
	import HIGHCHARTS from 'highcharts/highcharts';
	import com from 'common';
	import {mapState} from 'vuex';
	import handlerComponent from './handler.vue'
	import chartSettingComponent from './chartSetting.vue'
	export default {
		props:['config'],
		data(){
			let isShowFilter=this.config.config.option!=='none'||this.config.config.hasDate;
			let hasPie=false;
			let kpiKeys=Object.keys(this.config.config.kpiMap);
			kpiKeys.forEach(item=>{
				if(this.config.config.kpiMap[item].type=='pie'){
					hasPie=true;
				}
			});
			return {
				$$el: null,
				isShowFilter,
				containerHeight: this.config.h * com.config.heightPXPerUnit, //highchart容器高度，根据后台设置显示
				chartData: {}, //chart数据
				highChart: {}, //highchart实例对象
				customOptions: null, //后台未提供的chart配置项
				$container: null,//chart container dom对象
				isLoading: false, //loading图标
				chartKpiButtons: [],
				hasPie,
			}
		},
		directives:{

		},
		computed:{

		},
		methods: {
			//打开setting
			openSetting(){
				com.util.initConfig(this.config)
			},
			//初始化本页面相关的dom信息
			initDom() {
				this.$container = this.$$el.find('.chart-container-'+this.config.id);
				this.initButtons();
			},
			initButtons() {
				let that = this;
				let kpiMap=this.config.config.kpiMap;
				let keys=Object.keys(kpiMap);
				keys.forEach(item=>{
					that.chartKpiButtons.push(kpiMap[item]);
				})
			},
			//初始化chart相关配置信息
			initChartOption() {
				let that = this;
				that.customOptions={
					chart: {
						width:that.$container.width() - 20,
						renderTo: that.$container.get(0),
						spacingBottom: 1,
					},
					colors: com.config.chartColors,
					tooltip:{
						useHTML:true,
						padding:1
					},
					legend: { //legend样式
						navigation: {
							activeColor: com.config.chartLegendPaginationActiveColor,
							inactiveColor: com.config.chartLegendPaginationInactiveColor,
							style: {
								fontWeight: 'normal',
								color: '#666',
								fontSize: '12px'
							}
						},
						itemDistance: -20, //item之间的间距
						itemMarginTop: 5, //item之间行距
						maxHeight: 75, //设置legend区域高度
						useHTML: true,
						labelFormatter: function(e) {
							let html='';
							let obj=this
							let uuClass='';
							let visible=true;
							let kpiName='';
							let kpi=null;
							let name=this.name;
							if(this.series&&this.series.options.type=='pie'){
								obj=this.series;
								let time=that.chartData.xAxis;
								let index=this.index;
								name=obj.name+" "+time.categories[index];
							};
							kpiName=obj.options.kpiName
							visible=this.visible;
							uuClass=`${com.util.kpiTOClass(name)}-${this.index}`
							 return html=`<span class="chart-legend-item chart-legend-item-${uuClass} mcheckbox chart-checkbox">
								<input data-group='${kpiName}' class="chart-legend-checkbox chart-legend-checkbox-${uuClass}" type="checkbox"  ${visible?'checked':''}>
								<i style="background-color:${this.color}"></i><span
								class="chart-legend-text chart-legend-text-${this.index}">${name}</span>
							</span>`;
						}
					},
					plotOptions:{
						series:{
							events:{
								legendItemClick(e){//点击legend
									that.isLoading = true;
									let legendItemObj = this;
									setTimeout(function() {
										let classNames=`.chart-legend-checkbox-${com.util.kpiTOClass(legendItemObj.name)}-${legendItemObj.index}`
										let $checkbox = that.$$el.find(classNames);
										$checkbox.prop('checked', legendItemObj.visible);
										that.checkAllHideOrShow(legendItemObj);
										that.isLoading = false;
									}, 0);
								}
							}
						}
					},
					credits: {
						enabled: false
					},
				};
			},
			//取得filter信息
			getFilterInfo(customOpts={}, fromDataHandler=false) {
				return com.methods.getFilterInfo(this, customOpts, fromDataHandler);
			},
			//如果数据更新是从handler的setting发起，需检查当前object是否受hanlder影响，如果受影响的话，需同步handler数据
			applySettingFromHandler(){
				let opts = {};
				if (!$.isEmptyObject(this.config.dataHandlerConfig)) {
					if ($.inArray(this.config.id, this.config.dataHandlerController.filterObjects) != -1) {
						opts.dm = Object.assign({}, this.config.filterPostData, this.config.dataHandlerPageInfo.filterPostData);
					}
					if ($.inArray(this.config.id, this.config.dataHandlerController.dateObjects) != -1) {
						let str = JSON.stringify(this.config.dataHandlerPageInfo.dateSettingInfo);
						let dateSettingInfo = JSON.parse(str);
						this.config.dateSettingInfo = JSON.parse(str);
						opts.unit = dateSettingInfo.unit;
						opts.startDate = dateSettingInfo.start;
						opts.endDate = dateSettingInfo.end;
						opts.dateFilterData = dateSettingInfo.dateFilterData;
					}
					this.getChartData('dataHandlerApply', opts);
				}
			},
			//设定Y轴初始刻度为零
			setChartTickZero(data) {
				let hasNegative = false;
				//如果数据中存在负值，则不初始刻度为零
				for (let i = 0; i < data.series.length; i++) {
					for (let j = 0; j < data.series[i].data.length; j++) {
						if (data.series[i].data[j] < 0) {
							hasNegative = true;
							break;
						}
					}
					if (hasNegative) {
						break;
					}
				}
				if (!hasNegative) {
					data.yAxis.forEach(item => {
						item.min = 0;
					})
				}
			},
			//自定义与数据相关的配置项
			customDataOptions(data) {
				data.xAxis.labels = {
					style: {
						fontSize: '9px',
					}
				}
			},
			//取得chart相关数据，包含一部分chart的配置信息
			getChartData(type, customOpts={}) {
				let that = this;
				let options = {};
				let params = null;
				that.chartKpiButtons = [];
				that.isLoading = true;
				if (type === 'init') {
					params = that.getFilterInfo(customOpts);
				} else if (type === 'dataHandlerApply') {
					params = that.getFilterInfo(customOpts, true);
				}
				let tempParams = com.methods.addShortcutParams(JSON.parse(JSON.stringify(params)));
				com.util.promise({
					type:"POST",
					url: "/bip/report/data/" + tempParams.menuId,
					params:tempParams,
				}).then(data=>{
					$(document.body).trigger('click.hideDialog');
					that.initButtons();
					that.setChartTickZero(data);
					that.customDataOptions(data);
					that.chartData = $.extend(true,{},data, that.customOptions)
					that.applyChartSetting();
					//渲染一次 kpi
					that.$$el.find('.chart-setting-info').trigger('render');
				}).catch( ()=>{
					that.isLoading = false;
				})
			},
			/*合并本地chart数据*/
			margeLocalChartData(){
				let that=this;
				let chartData=$.extend(true,{},this.chartData);
				let pieData=[];
				let pieDataLegend=1;
				let height=this.containerHeight;
				let setSortIndex=function(type,text){//设置index
					let index=0;
					if(type=='line'||type=='spline'){
						index=50;
					}else if(type=='column'||type=='bar'){
						index=42;
						switch(text){
							case 'column':
								index=42;
								break;
							case 'stacked column':
								index=41;
								break;
							case 'stacked Bar':
								index=41;
								break;
							case 'stacked percentage column':
								index=40;
								break;
						}
					}else if(type=='area'){
						index=30;
						switch(text){
							case 'area':
								index=34;
								break;
							case 'time series':
								index=33
								break;
							case 'stacked area':
								index=32
								break;
							case 'percentage area':
								index=31
								break;
						};
					}else if(type=='pie'){
						index=20;
					};
					return index;
				};
				if(chartData.series){
					chartData.series.forEach(item=>{
						let name=item.kpiName;
						let kpi=that.config.config.kpiMap[name];
						item.visible=!kpi.hide;
					});
					chartData.series=chartData.series.filter(item=>item.visible);
					chartData.series.forEach((item,i)=>{
						let name=item.kpiName;
						let kpi=that.config.config.kpiMap[name];
						let options = that.customChartTypeMappingToNormal(kpi.type);
						let data=com.config.chartTypeMap[kpi.type];
						let colorLength=com.config.chartColors.length;
						let colorIndex=i%colorLength;//循环取色彩
						item.type=data.type;
						item.visible=!kpi.hide;
						item.zIndex=setSortIndex(item.type,kpi.type);
						item.legendIndex=i;//legend排序
						item.color=com.config.chartColors[colorIndex];//固定色彩
						if(kpi.type.indexOf('percentage')!==-1){//percent graph
							chartData.yAxis[item.yAxis].labels= {
								formatter: function() {
									return this.value+"%"
								}
				  			}
						};
						if(kpi.type=='time series'){//此处代码前提为，chart item 色彩固定，不然没有意义
							options.fillColor.stops=[
								[0, item.color],
								[1, HIGHCHARTS.Color( item.color ).setOpacity(0).get('rgba')]
							]
						};
						$.extend(true,item,options);
						item.showInLegend=!kpi.hide;
					});
					//饼图size算法
					pieData=chartData.series.filter(item=>item.type=='pie');
					pieDataLegend=pieData.length;
					pieData.forEach((item,i)=>{//等分
						item.size=100-(i/pieDataLegend)*100+"%";
					});
				};
				return chartData;
			},
			//根据数据，绘图
			renderChart() {
				let that = this;
				let $btnContainer = this.$$el.find('.chart-switch');
				let $chartSettingIcon = this.$$el.find('.chart-setting-icon');
				let chartData={};
				if(this.highcharts){//为了变轴，所以进行了销毁
					this.highcharts.destroy();
				}else{
					if (!this.chartData.series || (this.chartData.series && this.chartData.series.length == 0)) {
						this.$container.html(`
							<div class="nodata">
								<div class="nodata-text">No Data!</div>
							</div>
						`);
						this.highChart =null;
						$btnContainer.add($chartSettingIcon).addClass('hide');
					} else {
						that.chartData.chart.width = that.$container.width() - 20, //减20为防止左侧刻度过长右边框显示不全。
						chartData=this.margeLocalChartData();
						this.highChart = new HIGHCHARTS.Chart(chartData, function(chart){
							that.hideChartLegendSymbol(chart);//在chart初始化之后，回调隐藏legend前面的symbol
						})
						$btnContainer.add($chartSettingIcon).removeClass('hide');
					}
				}
			},
			//隐藏chart legend symbol
			hideChartLegendSymbol(chart) {
				var series = chart.series;
				$(series).each(function(i, serie) {//没有处理饼图
					if (serie.legendSymbol) {
						serie.legendSymbol.hide()
					};
					if (serie.legendLine) {
						serie.legendLine.hide()
					};
				});
			},
			//判断chart下面button是否显示
			checkAllHideOrShow(chart) {
				let key=chart.options.kpiName;
				let $kpiButton=this.$$el.find('.kpi-button').filter(`[value='${key}']`);
				let $checkboxGroup=this.$$el.find('.chart-legend-checkbox').filter(`[data-group='${key}']`);
				let status=$checkboxGroup.filter(":checked").length;
				if(status){
					$kpiButton.removeClass('off')
				}else{
					$kpiButton.addClass('off')
					this.applyChartSetting();
				};
				this.config.config.kpiMap[key].hide=!status;
				this.$$el.find('.chart-setting-info').trigger('render');//调用子层方法
			},
			//绑定页面dom事件
			bindDomEvent() {
				let that = this;
				that.$$el.on('resize-re-render', '.chart-container', function(e){ //窗口大小变化后重画图像
					if (that.highChart) {
						that.isLoading = true;
						setTimeout(function(){//有可能显示隐藏，需要在显示后重新计算
							if (that.$container.is(":visible") && (that.highChart.series && that.highChart.series.length > 0)) {
								that.highChart.setSize(that.$container.width())
								that.highChart.reflow();
							}
							that.isLoading = false;
						}, 0)
					}
				}).on('click', '.show-setting', function(e){//打开setting
					$('.common-setting').removeClass("active")
					that.$$el.find('.common-setting').addClass('active');
					that.$emit('reInitDateSetting');
				}).on('click', '.chart-setting-icon', function(e){//打开chart setting
					that.$$el.find('.chart-setting-'+that.config.id).addClass('open');
				}).on('click', '.kpi-button', function(e) { //点击kpi button
					that.isLoading = true;
					setTimeout(function(){
						if (that.highChart.series) {
							let $btn = $(e.target);
							let kpi = $btn.val();
							let status=$btn.hasClass('off')
							if (!status) { //隐藏
								$btn.addClass('off');
							} else { //显示
								$btn.removeClass('off');
							};
							that.config.config.kpiMap[kpi].hide=!status;
							that.$$el.find('.chart-setting-info').trigger('render');//调用子层方法
							that.applyChartSetting();
						}
						that.isLoading = false;
					}, 0)
				});
				//如果数据更新是从handler的setting发起，需检查当前object是否受hanlder影响，如果受影响的话，需同步handler数据
				that.$$el.on('apply-setting-from-handler', function(e){
					if ($.inArray(that.config.id, that.config.dataHandlerController.filterObjects) != -1 || $.inArray(that.config.id, that.config.dataHandlerController.dateObjects) != -1) {
						that.applySettingFromHandler();
					}
				})
			},
			//应用chart setting
			applyChartSetting(){
				let that = this;
				this.isLoading = true;
				setTimeout(function(){
					that.renderChart();
					that.isLoading = false;
				}, 0)
			},
			resetChartSetting() {//reset chart setting
				this.$$el.find('.btn-reset').trigger('click');
			},
			customChartTypeMappingToNormal(text) {
				let that = this;
				let options = {};
				//更新chart整体信息
				switch (text) {
					case 'time series':
						options = {
							fillColor: {
								linearGradient: {
									x1: 0,
									y1: 0,
									x2: 0,
									y2: 1
								},
							},
							marker: {
								radius: 2
							},
							stacking: null,
							tooltip: {
								split: false,
								headerFormat: null,
								pointFormat: null,
								tag:"time serie",
								pointFormatter(){
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p><span style="color:${this.color};"> \u25CF </span><span>${this.series.name} : </span><span style="font-weight:bold;">${formated}</span>`;
									return html;
								},
								shared: false,
							}
						}
						break;
					case 'stacked area':
						options = {
							stacking:'normal',
							tooltip: {
								split: false,
								headerFormat: null,
								tag:"stacked area",
								pointFormatter: function() {
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p><span style="color:${this.series.color}">${this.series.name}</span>: <b>${formated}</b><br/>`;
									return html;
								},
								shared: false,
								formatter: null,
							}
						}
						break;
					case 'percentage area':
						options = {
							stacking: 'percent',
							tooltip: {
								split: false,
								headerFormat: null,
								pointFormatter: function() {
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let percentage = this.percentage.toFixed(2)+"%";
									let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p><span style="color:${this.series.color}">${this.series.name}</span>: <b>${percentage}</b> (<b>${formated}</b>)<br/>`;
									return html;
								},
								shared: false,
								formatter: null,
							}
						}
						break;
					case 'stacked column':
						options = {
							stacking:'normal',
							tooltip: {
								split: false,
								headerFormat: '<b>{point.x}</b><br/>',
								pointFormatter: function() {
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let stackTotal =com.methods.dataDisplayFormatter(this.series.options.kpi,  (this.stackTotal||this.y));
									let html = `<span style="color:${this.series.color}">${this.series.name}</span>: <b>${formated}</b>`;
									return html;
								},
								shared: false,
								formatter: null,
							}
						}
						break;
					case 'stacked percentage column':
						options = {
							stacking: 'percent',
							tooltip: {
								split: false,
								headerFormat: '<b>{point.x}</b><br/>',
								pointFormatter: function() {
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let percentage = this.percentage.toFixed(2)+"%";
									let html = `<span style="color:${this.series.color}">${this.series.name}</span>: <b>${formated}</b><br/> (${percentage})<br/>`;
									return html;
								},
								shared: false,
								formatter: null,
							}
						}
						break;
					case 'stacked bar':
						options = {
							stacking: 'normal',
							tooltip: {
								split: false,
								headerFormat: null,
								pointFormat: null,
								pointFormatter(){
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p><span style="color:${this.color};"> \u25CF </span><span>${this.series.name} : </span><span style="font-weight:bold;">${formated}</span>`;
									return html;
								},
								shared: false,
							}
						}
						break;
					case 'pie':
						options = {
							showInLegend:true,
							point: {
								events: {
									legendItemClick: function (e) {
										that.isLoading = true;
										let time=that.chartData.xAxis;
										let legendItemObj = this;
										let name=this.series.name+" "+time.categories[this.series.index]
										setTimeout(function() {
											let $checkbox = that.$$el.find('.chart-legend-checkbox-' +com.util.kpiTOClass(name)+'-'+ legendItemObj.index);
											$checkbox.prop('checked', legendItemObj.visible);
											that.checkAllHideOrShow(legendItemObj.series);
											that.isLoading = false;
										}, 0);
									}
								}
							},
							dataLabels: {
								enabled: false,
								useHTML:true,
								formatter(e){
									let time=that.chartData.xAxis;
									let index=this.point.index;
									let name="";
									if($.isPlainObject(time)&&$.isArray(time.categories)){
										name=time.categories[index]+" ";
									};
									name+=this.series.name
									return `<span style='color:#000'>${name}</span>`
								}
							},
							states:{
								hover:{
									enabled:true,
								}
							},
							tooltip: {
								split: false,
								headerFormat: '',
								pointFormatter: function() {
									let percentage = this.percentage.toFixed(2);
									let time=that.chartData.xAxis;
									let index=this.index;
									let name="";
									if($.isPlainObject(time)&&$.isArray(time.categories)){
										name=time.categories[index]
									};
									name=this.series.name+" "+name;
									let html = `<span><span style="color:${this.color};"> \u25CF </span> ${name}</span>: <b>${com.methods.thousandsSeparator(this.y)}(${percentage}%)</b>`;
									return html;
								},
								shared: false,
								formatter: null,
							}
						}
						break;
					case 'funnel':
						options = {}
						break;
					default:
						options = {
							tooltip: {
								split: false,
								headerFormat: null,
								pointFormat: null,
								tag:"line bar other",
								pointFormatter(){
									let formated = com.methods.dataDisplayFormatter(this.series.options.kpi, this.y);
									let html = `<p style="line-height:22px;padding:0;margin:0;">${this.category}</p>
										<span style="color:${this.color};"> \u25CF </span>
										<span>${this.series.name} : </span>
										<span style="font-weight:bold;">${formated}</span>`;
									return html;
								},
								shared: false,
							}
						}
						break;
				}
				return options;
			},
		},
		mounted(){
			let that = this;
			that.$$el = $(this.$el);
			that.initDom();
			that.initChartOption();
			that.getChartData('init');
			that.bindDomEvent();
		},
		components: {
			handlerComponent,
			chartSettingComponent
		}
	}
</script>
