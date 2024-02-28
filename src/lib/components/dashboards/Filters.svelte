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
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let drawer: boolean = false

	const dashboard = getContext<Writable<any>>('dashboard')
	const { trocModule } = $page.data

	let filters: any
	let filtersArray: any[]
	let filtersSorted: Record<string, any>

	onMount(() => {
		loadData()
	})

	const loadData = () => {
		filters = $dashboard?.filtering_show
			? { ...$dashboard?.filtering_show }
			: trocModule.filtering_show
			? { ...trocModule.filtering_show }
			: {}

		filtersArray = Object.entries(filters?.filtering || {})
		filtersSorted = Object.fromEntries(filtersArray.sort((a, b) => a[1].order - b[1].order))

		if ($dashboard.where_cond) {
			for (const key in $dashboard.where_cond) {
				if (filtersSorted[key]) {
					filtersSorted[key].selected = $dashboard.where_cond[key]
				}
			}
		}
		fillDropdowns()
	}

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
		if (
			selectedItem &&
			((typeof selectedItem === 'string' && selectedItem !== '') || selectedItem?.value !== '')
		) {
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
			fillDropdowns()
		}
	}

	const apply = () => {
		const whereConditions: Record<string, any> = {}
		let dateConditions: string = ''
		for (const key in filtersSorted) {
			if (filtersSorted[key].selected) {
				if (filtersSorted[key].type === 'date') {
					dateConditions = filtersSorted[key].selected
				} else {
					whereConditions[filtersSorted[key].id] = filtersSorted[key].selected.value
				}
			}
		}
		$dashboard.where_new_cond = { ...$dashboard.where_cond, ...whereConditions }
		$dashboard.where_date_cond = dateConditions
		// $dashboard.loaded = false
		$dashboard.gridItems.map((item) => {
			item.reload = true
		})
		if (drawer) hideDashboardFilters.set(true)
	}

	let loadedDashboardId: string
	$: if ($dashboard.where_new_cond) {
		for (const key in $dashboard.where_new_cond) {
			if (filtersSorted[key]) {
				if (filtersSorted[key].type !== 'date') {
					filtersSorted[key].selected = $dashboard.where_new_cond[key]
				}
			}
		}
		fillDropdowns()
	} else if (loadedDashboardId !== $dashboard.dashboard_id) {
		for (const key in filtersSorted) {
			if (filtersSorted[key].selected) delete filtersSorted[key].selected
		}
		fillDropdowns()
		loadedDashboardId = $dashboard.dashboard_id
	}

	$: if ($dashboard.where_date_cond) {
		const _date = $dashboard.where_date_cond.split(' - ')[1] || $dashboard.where_date_cond
		filtersSorted['date'].selected = _date
	}

	const cols = drawer ? 1 : 4 //_.filter(filtersSorted, { hierarchy: true }).length
</script>

{#if filtersSorted}
	<div class="md:grid md:grid-cols-{cols}  md:gap-2 md:p-1">
		{#each Object.entries(filtersSorted) as [key, value], idx}
			<div class="mt-4 p-0 pl-2 pr-2 md:mt-0">
				{#if !value.type}
					<Single
						{value}
						selectedValue={value.selected?.value}
						on:change={(e) => selectItem(key, e.detail)}
					/>
				{:else if value.type === 'date'}
					<Date
						selectedValue={value.selected}
						params={value?.params}
						on:change={(e) => selectItem(key, e.detail)}
					/>
				{/if}
			</div>
			{#if value.jump}<div class="col-span-{cols - idx - 1}" />{/if}
		{/each}
	</div>
	<div
		class="border-gay-200 mt-2 flex flex-row justify-end border-t-[1px] p-4 pr-2 dark:border-dark-200"
	>
		<Button
			class=" flex flex-row items-center rounded-md bg-primary  px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
			on:click={() => apply()}
		>
			<Icon icon="mdi:filter" size="18" classes="mr-1" />
			Apply
		</Button>
	</div>
{/if}
