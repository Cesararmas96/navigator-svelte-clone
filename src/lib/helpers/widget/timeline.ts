/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, type Writable } from 'svelte/store'

export const actionReorder: { [key: string]: (dashboard: Writable<any>, data: any[]) => any } = {
	reorderAction(dashboard: Writable<any>, data: any[]) {
		const locations: any[] = []
		const stores = [...get(dashboard).gridItemsData['stores']]

		data.forEach((item) => {
			const store = stores.find((_store) => _store.store_name === item)
			locations.push({ lat: store.latitude, lng: store.longitude })
		})

		dashboard.update((_dashboard) => {
			_dashboard.gridItemsData['Map'] = { locations }
			return _dashboard
		})
	}
}
