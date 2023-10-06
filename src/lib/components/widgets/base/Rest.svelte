<script lang="ts">
	import { addWidgetData } from '$lib/helpers/widget/data'
	import { getData } from '$lib/services/getData'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let widget: Writable<any>
	let widgetActions: any = getContext('widgetActions')

	const url = $widget.query_slug.url
	const method = $widget.query_slug.method
	const body = $widget.query_slug.body

	let data: any
	let dataStore: any = getContext('widgetData')

	async function fetchData() {
		data = getData(url!, method)
		addWidgetData(dataStore, data)
	}

	// $widgetActions = addWidgetAction($widgetActions, 'maximizeWidget', () => {
	// 	storeData(data, $widget)
	// })
	// $widgetActions = addWidgetAction($widgetActions, {
	//     name: "reloadFetchData",
	//     action: () => fetchData()
	// });

	onMount(() => {
		if (!$dataStore) {
			fetchData()
		} else {
			data = $dataStore
		}
	})
</script>

{#await data}
	<p>loading</p>
{:then data}
	<slot {data} />
{/await}
