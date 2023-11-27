<script>
	import moment from 'moment'
	import { onMount } from 'svelte'
	import { map } from 'lodash-es'
	import { Button, Select, Radio } from 'flowbite-svelte'
	import { capitalizeWord } from '$lib/helpers/common/common'

	export let widget
	export let loading = false

	let slug =
		widget.query_slug && widget.query_slug.slug && Array.isArray(widget.query_slug.slug)
			? Object.values(widget.query_slug.slug[0])[0] || null
			: widget.query_slug.slug
	let slugs = []
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

	let datepicker = null
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

	onMount(() => {
		if (filterOptions.dateRange && filterOptions.dateRange.show) {
			date = filterOptions.dateRange.default ? filterOptions.dateRange.default : 'mtd'
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
		console.log('Slug', slug)
		console.log('Date', date)
		console.log('Grouping', grouping)
	}

	function get_mtd(period) {
		return {
			firstdate: period[0],
			lastdate: period[1]
		}
	}

	function get_ytd(period) {
		return {
			firstdate: moment(period[0]).startOf('year').format('YYYY-MM-DD'),
			lastdate: period[1]
		}
	}

	function get_tm(period) {
		return {
			firstdate: moment(period[0]).subtract(3, 'month').startOf('month').format('YYYY-MM-DD'),
			lastdate: period[1]
		}
	}

	function get_lm(period) {
		return {
			firstdate: moment(period[0]).subtract(1, 'month').format('YYYY-MM-DD'),
			lastdate: period[1]
		}
	}

	function get_fm(period) {
		return {
			firstdate: moment(period[0]).subtract(1, 'month').format('YYYY-MM-DD'),
			lastdate: period[1]
		}
	}

	function get_yoy(period) {
		return {
			firstdate: moment(period[0]).subtract(13, 'month').startOf('month').format('YYYY-MM-DD'),
			lastdate: period[1]
		}
	}
</script>

<div class="">
	<div class="flex items-center gap-4 pt-1">
		{#if filterOptions.datepicker && filterOptions.datepicker.show}
			<div class="w-64">
				<!-- Your datepicker component here -->
			</div>
		{/if}

		{#if Object.keys(slugs).length > 0}
			<div class="w-64">
				<Select size="sm" class="mt-2" items={slugs} bind:value={slug} />
			</div>
		{/if}

		{#if filterOptions.dateRange && filterOptions.dateRange.show}
			<div class="w-64">
				<Select size="sm" class="mt-2" items={dates} bind:value={date} />
			</div>
		{/if}

		{#if filterOptions.grouping}
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
			<Button type="button" class="btn btn-primary" on:click={setRange}>
				{#if loading}
					Loading...
				{:else}
					Apply
				{/if}
			</Button>
		</div>
	</div>
</div>
