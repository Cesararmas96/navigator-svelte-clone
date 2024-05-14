export default function () {
	const option = {
		textStyle: {
			fontSize: 12,
			height: 80
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
		grid: {
			top: '15%',
			left: '3%',
			right: '3%',
			bottom: '3%',
			containLabel: true
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
				rotate: 0
				// formatter:
				//   $widget.params!.graph && $widget.params!.graph.xformat
				//     ? function (value: any, index: any) {
				//         return fnFormatEchart(value)
				//       }
				//     : `{value}`,
			}
		},
		// yAxis: {
		// 	type: 'value'
		// },
		dataset: {
			source: []
		},
		series: [],
		yAxis: [
			{
				type: 'value'
			},
			{
				type: 'value'
			}
		]
	}

	// widget.option!.value.series = widget.generateSeriesDefault!('barline')

	return option
}
