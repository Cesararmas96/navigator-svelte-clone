<script lang="ts">
	import { page } from '$app/stores'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>

	const dashboard: Writable<any> = getContext('dashboard')
	const { trocModule } = $page.data

	const filters = $dashboard?.filtering_show
		? { ...$dashboard?.filtering_show }
		: trocModule.filtering_show
		? { ...trocModule.filtering_show }
		: {}

	const filtersArray: any[] = Object.entries(filters?.filtering || {})
	const filtersSorted: Record<string, any> = Object.fromEntries(
		filtersArray.sort((a, b) => a[1].order - b[1].order)
	)

	let filtersApplied: string[] = []

	$: if ($dashboard.where_new_cond) {
		// console.log($dashboard.where_new_cond)
		filtersApplied = []
		for (const key in $dashboard.where_new_cond) {
			const filter = filtersSorted[key.replace('_id', '')]
			if (!filter || !filter.selected) continue
			filtersApplied.push(`${filter.name}: ${filter.selected.label}`)
		}
		// console.log(filtersApplied)
	}
</script>

<!-- <div id={`widget-content-bottom-${$widget.widget_id}`}>{filtersApplied.join(', ')}</div> -->
<div id={`widget-content-bottom-${$widget.widget_id}`} />
