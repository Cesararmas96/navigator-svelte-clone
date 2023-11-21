<script lang="ts">
	import { page } from '$app/stores'
	import { hideDashboardFilters, storeDashboard } from '$lib/stores/dashboards'
	import { storeStores } from '$lib/stores/modules'
	import _ from 'lodash'
	import Date from './filter/Date.svelte'
	import Single from './filter/Single.svelte'
	import { storeUser } from '$lib/stores'
	import { Button } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let drawer: boolean = false

	const dashboard = getContext<Writable<any>>('dashboard')

	const { trocModule } = $page.data

	let filters = $storeDashboard?.filtering_show || trocModule.filtering_show || {}

	const filtersArray: any[] = Object.entries(filters?.filtering)
	const filtersSorted: Record<string, any> = Object.fromEntries(
		filtersArray.sort((a, b) => a[1].order - b[1].order)
	)

	const fillDropdowns = () => {
		if (!$storeStores || !$storeStores[$page.params.programs]) return
		let selectedFilters: any[] = []
		for (const key in filtersSorted) {
			if (filtersSorted[key].type === 'date') continue
			const grouped = _.groupBy($storeStores[$page.params.programs], (item) => {
				if (
					selectedFilters.length > 0 &&
					!selectedFilters.every((filtro) => item[filtro.id].toString() === filtro.value)
				)
					return

				return `${item[filtersSorted[key].id]}||${item[filtersSorted[key].value]}`
			})
			if (grouped.undefined) delete grouped.undefined
			const items = _.map(grouped, (group, key) => {
				const [value, label] = key.split('||')
				return { value, label }
			})

			filtersSorted[key].items = items

			if ($storeUser.aux.filtering_fixed && $storeUser.aux.filtering_fixed[filtersSorted[key].id]) {
				filtersSorted[key].selected = {
					value: $storeUser.aux.filtering_fixed[filtersSorted[key].id].toString(),
					label: items.find(
						(item) =>
							item.value === $storeUser.aux.filtering_fixed[filtersSorted[key].id].toString()
					)?.label
				}
				filtersSorted[key].disabled = true
			}

			if (filtersSorted[key].selected) {
				selectedFilters.push({
					id: filtersSorted[key].id,
					value: filtersSorted[key].selected.value
				})
			}
		}
	}

	const selectItem = (key: string, selectedItem: any) => {
		if (selectedItem.value !== '') {
			filtersSorted[key].selected = selectedItem
		} else {
			delete filtersSorted[key].selected
		}
		if (filtersSorted[key].hierarchy) {
			for (const _key in filtersSorted) {
				if (filtersSorted[key].order < filtersSorted[_key].order && filtersSorted[_key].hierarchy) {
					filtersSorted[_key].reset = true
					delete filtersSorted[_key].selected
				} else {
					delete filtersSorted[key].reset
				}
			}
		}
		fillDropdowns()
	}

	const apply = () => {
		const whereConditions: Record<string, any> = {}
		for (const key in filtersSorted) {
			if (filtersSorted[key].selected) {
				whereConditions[filtersSorted[key].id] = filtersSorted[key].selected.value
			}
		}
		$dashboard.where_cond = { ...$dashboard.where_cond, ...whereConditions }
		$dashboard.loaded = false
		if (drawer) hideDashboardFilters.set(true)
	}

	$: if ($storeStores && $storeStores[$page.params.programs]) {
		fillDropdowns()
	}

	$: if ($dashboard.where_cond) {
		for (const key in $dashboard.where_cond) {
			if (filtersSorted[key]) {
				filtersSorted[key].selected = $dashboard.where_cond[key]
			}
		}
		fillDropdowns()
	}

	const cols = drawer ? 1 : _.filter(filtersSorted, { hierarchy: true }).length
</script>

<div class="grid grid-cols-{cols} gap-4 p-4">
	{#each Object.entries(filtersSorted) as [key, value]}
		<div class={value.jump ? `col-span-${cols}` : ''}>
			{#if !value.type}
				<Single
					{value}
					selectedValue={value.selected?.value}
					on:change={(e) => selectItem(key, e.detail)}
				/>
			{:else if value.type === 'date'}
				<Date />
			{/if}
		</div>
	{/each}
</div>
<div class="border-gay-200 flex flex-row justify-end border-t-[1px] p-4 dark:border-dark-200">
	<Button
		class="flex flex-row items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
		on:click={() => apply()}
	>
		<Icon icon="mdi:filter" size="18" classes="mr-1" />
		Apply
	</Button>
</div>
