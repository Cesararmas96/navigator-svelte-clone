/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Writable } from 'svelte/store'

export const actionsMapsPostRender: {
	[key: string]: (dashboard: Writable<any>, data: any[]) => any
} = {
	calculateDistanceAndDuration(dashboard: Writable<any>, data: any) {
		let totalDistance = 0
		let totalDuration = 0

		const route = data.routes[0]
		for (const leg of route.legs) {
			totalDistance += leg.distance.value
			totalDuration += leg.duration.value
		}

		const totalDistanceInMiles = totalDistance / 1609.34
		// const totalDistanceInKm = (totalDistance = totalDistance / 1000)
		totalDuration = totalDuration / 60

		dashboard.update((_dashboard) => {
			_dashboard.gridItemsData['Total Duration'] = [{ 'Total Duration': totalDuration.toFixed(2) }]
			_dashboard.gridItemsData['Total Distance'] = [
				{ 'Total Distance': totalDistanceInMiles.toFixed(2) }
			]
			return _dashboard
		})
	}
}
