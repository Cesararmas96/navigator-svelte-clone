<script lang="ts">
	import { page } from '$app/stores'
	import { storeDashboard } from '$lib/stores/dashboards'
	import { storeStores } from '$lib/stores/modules'
	import _ from 'lodash'
	import Dropdown from '../common/Dropdown.svelte'
	import Date from './filter/Date.svelte'

	const { trocModule } = $page.data
	console.log('filters', $storeDashboard?.filtering_show)
	console.log('filters', trocModule)
	let filters = $storeDashboard?.filtering_show || trocModule.filtering_show
	let markets: any[]

	const filtersArray = Object.entries(filters.filtering)
	const filtersSorted = Object.fromEntries(filtersArray.sort((a, b) => a[1].order - b[1].order))

	console.log(filtersSorted)

	const fillDropdowns = () => {
		for (const key in filtersSorted) {
			const grouped = _.groupBy(
				$storeStores[$page.params.programs],
				(item) => `${item[filtersSorted[key].id]}||${item[filtersSorted[key].value]}`
			)
			const items = _.map(grouped, (group, key) => {
				const [value, label] = key.split('||')
				return { value, label }
			})
			filtersSorted[key].items = items
		}
	}

	$: if ($storeStores && $storeStores[$page.params.programs]) {
		fillDropdowns()
	}

	const cols = _.filter(filtersSorted, { hierarchy: true }).length
</script>

<!-- {#if markets && markets.length > 0}
	<Dropdown items={markets} />
{/if} -->
<div class="grid grid-cols-{cols} grid-rows-1 gap-4">
	{#each Object.entries(filtersSorted) as [key, value]}
		{#if !value.type}
			<Dropdown items={value.items} label={value.name} defaultClass="w-full" labelClass="mb-0" />
		{:else if value.type === 'date'}
			<Date />
		{/if}
	{/each}
</div>
