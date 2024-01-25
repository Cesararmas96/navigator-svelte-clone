<script lang="ts">
	import moment from 'moment'
	import { getContext, onMount } from 'svelte'
	import { map, pullAll, merge } from 'lodash-es'
	import { Button, Select, Radio } from 'flowbite-svelte'
	import { capitalizeWord } from '$lib/helpers/common/common'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'

	export let widget
	export let loading = false
	const dashboard: Writable<any> = getContext('dashboard')
	const widgetActions: any = getContext('widgetActions')

	let slug =
		widget.query_slug && widget.query_slug.slug && Array.isArray(widget.query_slug.slug)
			? Object.values(widget.query_slug.slug[0])[0] || null
			: widget.query_slug.slug
	let slugs: Array<any> = []
	map(
		widget.query_slug && widget.query_slug.slug && Array.isArray(widget.query_slug.slug)
			? Object.values(widget.query_slug.slug)
			: [],
		function (items) {
			map(items, function (item, itemIndex) {
				slugs.push({ value: item, name: itemIndex })
			})
		}
	)

	let datepicker: string = ''
	let dates = [
		{ value: 'mtd', name: 'Month to Date' },
		{ value: 'lm', name: 'Previous Month to Date' },
		{ value: 'tm', name: 'Previous 3 Months' },
		{ value: 'ytd', name: 'Year to Date' },
		{ value: 'yoy', name: 'Last 13 Months' }
	]
	let date = null
	let filterOptions = widget.params.filter
	let grouping = filterOptions.groupingDefault || null
	let conditionsDefault = {}

	onMount(() => {
		if (filterOptions.dateRange && filterOptions.dateRange.show) {
			date = filterOptions.dateRange.default ? filterOptions.dateRange.default : 'mtd'
		}

		if (widget.filter_conditions) {
			conditionsDefault = widget.filter_conditions
		}
	})

	let filterDateDashboard

	// $: {
	// 	filterDateDashboard =
	// 	  $store.state.navigator.dashboard.dashboard_id &&
	// 	  $store.state.filtering.filterDate[
	// 	    $store.state.navigator.dashboard.dashboard_id
	// 	  ] &&
	// 	  widget.dashboard_id ===
	// 	    $store.state.navigator.dashboard.dashboard_id
	// 	    ? $store.state.filtering.filterDate[
	// 	        $store.state.navigator.dashboard.dashboard_id
	// 	      ]
	// 	    : null;

	// 	if (filterDateDashboard) {
	// 		datepicker = `${filterDateDashboard[0]} - ${filterDateDashboard[1] || filterDateDashboard[0]}`
	// 	}
	// }

	function setRange() {
		// console.log('Slug', slug)
		// console.log('Date', date)
		// console.log('Grouping', grouping)

		try {
			const newSlug = slugs[slug] || slug

			let conditions: Record<string, any> = {}

			if (
				(filterOptions?.dateRange && filterOptions?.dateRange?.show) ||
				(filterOptions?.datepicker && filterOptions?.datepicker?.show)
			) {
				let period: Array<any> = []
				const widgetConditions: Record<string, any> = conditionsDefault

				if (dashboard?.where_date_cond) {
					const date = dashboard?.where_date_cond.split(' - ')

					period = [date[0], date[1] || date[0]]
				} else {
					if (widgetConditions?.filterdate) {
						period = [widgetConditions?.filterdate, widgetConditions?.filterdate]
					} else {
						period = [widgetConditions?.firstdate, widgetConditions?.lastdate]
					}
				}

				if (datepicker) {
					period = datepicker.split(' - ')
					conditions = {
						firstdate: period[0],
						lastdate: period[1]
					}
				}

				if (typeof dateFunctions[`get_${date}`] === 'function') {
					conditions = dateFunctions[`get_${date}`](period)
				}
			}

			if (filterOptions?.grouping) {
				conditions.grouping = filterOptions?.grouping[grouping]

				if (widget?.conditions && widget?.conditions?.ordering) {
					conditions.ordering = filterOptions?.grouping[grouping]
				}

				if (slug && slug.fields) {
					conditions.fields = [conditions.grouping].concat(
						pullAll(slug.fields, Object.values(filterOptions.grouping))
					)
				} else if (
					widget.filter_conditions &&
					widget.filter_conditions.fields &&
					Array.isArray(widget.filter_conditions.fields)
				) {
					conditions.fields = [conditions.grouping].concat(
						pullAll(
							merge([], widget.filter_conditions.fields, []),
							Object.values(filterOptions.grouping)
						)
					)
				}
			}

			if (slug?.conditions) {
				conditions = merge({}, conditions, slug.conditions)
			}

			widget.new_query_slug = slug && slug.slug ? slug.slug : slug
			widget.filter_conditions = conditions
			widget.customDate = true

			const reloadAction = getWidgetAction($widgetActions, 'reloadFetchData')
			reloadAction.action()
		} catch (error) {
			console.log(error)
		}
	}

	const dateFunctions = {
		get_mtd(period) {
			// MONTH to DATE
			return {
				firstdate: period[0],
				lastdate: period[1]
			}
		},
		get_ytd(period) {
			// YEAR to DATE
			return {
				firstdate: moment(period[0]).startOf('year').format('YYYY-MM-DD'),
				lastdate: period[1]
			}
		},
		get_tm(period) {
			// THREE MONTHS
			return {
				firstdate: moment(period[0]).subtract(3, 'month').startOf('month').format('YYYY-MM-DD'),
				lastdate: period[1]
			}
		},
		get_lm(period) {
			// PREVIOUS MONTH
			return {
				firstdate: moment(period[0]).subtract(1, 'month').format('YYYY-MM-DD'),
				lastdate: period[1]
			}
		},
		get_fm(period) {
			// PREVIOUS FULL MONTH
			return {
				firstdate: moment(period[0]).subtract(1, 'month').format('YYYY-MM-DD'),
				lastdate: period[1]
			}
		},
		get_yoy(period) {
			// PREVIOUS 13 Months
			return {
				firstdate: moment(period[0]).subtract(13, 'month').startOf('month').format('YYYY-MM-DD'),
				lastdate: period[1]
			}
		}
	}
</script>

<div class="">
	<div class="mt-1 flex h-9 items-center gap-4">
		{#if filterOptions?.datepicker && filterOptions?.datepicker?.show}
			<div class="w-64">
				<!-- Your datepicker component here -->
			</div>
		{/if}

		{#if Object.keys(slugs).length > 0}
			<div class="ml-1 w-64">
				<Select size="sm" class="h-9 py-0 align-middle" items={slugs} bind:value={slug} />
			</div>
		{/if}

		{#if filterOptions?.dateRange && filterOptions?.dateRange?.show}
			<div class=" ml-1 w-64">
				<Select size="sm" class="h-9 py-0 align-middle" items={dates} bind:value={date} />
			</div>
		{/if}

		{#if filterOptions?.grouping}
			<div>
				<ul class="flex">
					{#each filterOptions.groupingOrder || Object.keys(filterOptions.grouping) as group}
						<li class="w-full">
							<Radio bind:group={grouping} value={group} class="p-3">{capitalizeWord(group)}</Radio>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="">
			<Button type="button" size="md" class="h-9" on:click={setRange}>
				{#if loading}
					Loading...
				{:else}
					Apply
				{/if}
			</Button>
		</div>
	</div>
</div>
