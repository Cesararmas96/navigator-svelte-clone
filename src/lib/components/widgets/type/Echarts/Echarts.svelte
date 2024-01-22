<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte'
	import * as echarts from 'echarts'
	import { themeColor, themeMode } from '$lib/stores/preferences'
	import { fetchDarkMode, fetchThemeColor } from './theme'
	import { merge, map, uniqBy, result, find, without, last, union, orderBy } from 'lodash-es'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction, getWidgetAction } from '$lib/helpers'
	import { gridHeight, gridInstanceHeight } from '$lib/helpers/widget/aggrid'
	import { setContentHeight } from '$lib/helpers/widget/widget'

	export let data: any
	const widget: any = getContext('widget')
	const dashboard = getContext<Writable<any>>('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')

	export let id = 'chart-' + $widget.widget_id
	export let theme = 'macarons'
	export let width = 200
	export let height = 200
	export let options = {
		textStyle: {
			fontSize: 12,
			height: 80,
			fontFamily: 'Montserrat, Helvetica, Arial, sans-serif'
		},
		grid: {
			top: '15%',
			left: '3%',
			right: '3%',
			bottom: '3%',
			containLabel: true
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			top: '20',
			orient: 'horizontal',
			textStyle: {
				color: '#333',
				fontSize: '13'
			}
		},
		// color: map(
		//   Object.keys($widget.colors!),
		//   // @ts-ignore
		//   (color: string) => $widget.colors![color]
		// ),
		resizable: true,
		xAxis: {
			type: 'category',
			axisLabel: {
				rotate: 30
				// formatter:
				//   $widget.params!.graph && $widget.params!.graph.xformat
				//     ? function (value: any, index: any) {
				//         return fnFormatEchart(value)
				//       }
				//     : `{value}`,
			}
		},
		yAxis: {
			type: 'value'
		},
		dataset: {
			source: []
		},
		series: []
	}
	// export let notMerge = false
	// export let replaceMerge = undefined
	// export let lazyUpdate = false
	let series =
		$widget.params.graph &&
		$widget.params.graph.series &&
		Object.keys($widget.params.graph.series).length > 0 // Old version
			? $widget.params.graph.series
			: $widget.format_definition && Object.keys($widget.format_definition).length > 0 // New version
			? $widget.format_definition
			: {}

	let chart // our chart instance

	const buildOptions = async () => {
		if (chart && !chart.isDisposed()) {
			const type = $widget.params.graph && $widget.params.graph.type
			const typeConfig = await import(`./types/${type}.ts`).catch(() => {})

			if (typeConfig && typeConfig.default) {
				options = merge({}, options, typeConfig.default())
			} else {
				// options.series = generateSeriesDefault!(type)
			}
			options.series = generateSeriesDefault!(type)

			// console.log(options)
			options = merge({}, options, $widget?.params?.echarts || {}, {
				dataset: {
					source: data
				}
			})

			chart.setOption(options)

			// chart.setOption(options, notMerge, replaceMerge, lazyUpdate, {
			// 	dataset: {
			// 		source: data
			// 	}
			// })

			// console.log(chart)
		}
	}

	const destroyChart = () => {
		if (chart && !chart.isDisposed()) {
			chart.dispose()
		}
	}

	const makeChart = (mode: string = '') => {
		destroyChart()
		theme = mode === 'dark' ? 'dark' : $themeColor
		chart = echarts.init(document.getElementById(id), 'macarons')
	}

	function generateSeriesDefault(typeEchart: string) {
		const series: any[] = []
		let type: any = typeEchart
		let config: Record<string, any> = {}

		if (typeEchart === 'echarts' || typeEchart === 'dimensions') {
			type = 'bar'
		}

		if (typeEchart === 'area') {
			type = 'line'
			config = {
				areaStyle: {}
			}
		}

		const categoriesIndex = Object.keys(data![0] || {})

		const graph = $widget.params!.graph || {}
		const xkey = graph.xkey || categoriesIndex[0]
		const ykey = graph.ykey || without(categoriesIndex, xkey)
		const yline = graph.yline
			? Array.isArray(graph.yline)
				? graph.yline
				: [graph.yline]
			: [last(ykey)]

		union(ykey, yline).map((xdata: any, xdataIdx) => {
			let serieExtend: any = generateSeriesBD(xdata)

			if (!serieExtend.hidden) {
				// if (xdataIdx !== 0) {
				// console.log(serieExtend)
				// console.log(xdata)
				// console.log(xdataIdx)
				if (typeEchart === 'barline') {
					if (xdataIdx === union(ykey, yline).length - 1) {
						type = 'line'
						config = {
							yAxisIndex: 1
						}
					} else {
						type = 'bar'
					}
				}

				if (serieExtend.average !== false) {
					serieExtend['markLine'] = {
						data: [
							{
								type: 'average'
							}
						],
						silent: true
					}
				}

				series.push(
					merge(
						{},
						{
							type: type,
							// name: useFormat(xdata, 'capitalize'),
							name: xdata,
							markPoint: {
								data: [
									{ type: 'max', name: 'Max' },
									{ type: 'min', name: 'Min' }
								],
								label: {
									color: '#000',
									fontSize: 10
								}
							},
							barGap: 0,
							label: {
								show: true,
								position: 'top',
								color: '#000'
							},
							emphasis: {
								focus: 'series'
							}
						},
						config,
						serieExtend
					)
				)
				// }
			} else {
				map(data, (item) => delete item[xdata])
			}
		})

		return orderBy(series, ['order'], ['asc'])
	}

	function generateSeriesBD(name: string) {
		const serie = ($widget.series && $widget.series[name]) || {}

		let labelHide = true
		if (serie.label_hide) {
			labelHide = false
		}
		return merge({}, serie, {
			order: serie.order,
			type: serie.type,
			stack: serie.stack,
			name: serie.label_name,
			step: serie.step,
			yAxisIndex: serie.yAxisIndex,
			label: {
				show: labelHide,
				position: serie.label_position || 'top',
				color: serie.label_color,
				fontSize: serie.label_size || 12,
				shadowBlur: 80,
				shadowColor: 'rgba(0, 0, 0, 0.5)',
				formatter: (params: any) => {
					try {
						if (serie.format) {
							return params.data[name]
						}
					} catch (error) {}
				}
			},
			showAllSymbol: true,
			symbol: serie.symbol || 'emptyCircle',
			// itemStyle: {
			// 	color: $widget.colors![serie.color]
			// },
			animationDelay(idx: any) {
				return idx * 10
			}
		})
	}

	onMount(async () => {
		$themeColor = document.documentElement.getAttribute('data-theme-color')!
		await fetchDarkMode()
		await fetchThemeColor($themeColor)

		makeChart($themeMode)
		resizeEchartToContent()
		if ($dashboard?.attributes?.explorer === 'v2') {
			// console.log('resizeAction')
			resizeAction.action()
		}
	})

	onDestroy(() => {
		destroyChart()
	})

	let timeoutId: any
	const handleResize = () => {
		if (timeoutId == undefined) {
			timeoutId = setTimeout(() => {
				if (chart && !chart.isDisposed()) {
					chart.resize()
				}
				timeoutId = undefined
			}, 500)
		}
	}

	$: width && handleResize()
	// $: options && buildOptions()
	$: if (chart && theme) {
		makeChart()
		buildOptions()
	}

	const resizeEchartToContent = () => {
		setContentHeight($widget.widget_id)
		const eChartDiv: HTMLElement = document.querySelector(`#${id}`)!
		eChartDiv.style['min-height'] = !$widget.temp
			? gridHeight($widget.widget_id)
			: gridInstanceHeight($widget.widget_id)
		eChartDiv.style['height'] = eChartDiv.style['min-height']
		$widget.resized = false
	}
	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: () => {
			setContentHeight($widget.widget_id)
			resizeEchartToContent()
		}
	})
</script>

{#if data}
	<div bind:clientWidth={width}>
		<div {id} />
	</div>
{/if}

<style>
	/* .app {
		width: 100vw;
		height: 100vh;
	} */
</style>
