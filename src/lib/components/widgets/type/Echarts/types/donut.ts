/* eslint-disable @typescript-eslint/no-explicit-any */
export default function (graph: Record<string, any>) {
	const option = {
		title: {
			text: '',
			subtext: '',
			left: 'center'
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'horizontal',
			left: 'center',
			top: 'bottom'
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: graph.pie ? '60%' : ['30%', '60%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 5,
					borderColor: '#fff',
					borderWidth: 1
				},
				data: [],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	}

	// widget.option!.value.series = widget.generateSeriesDefault!('barline')

	return option
}
