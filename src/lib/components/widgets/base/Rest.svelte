<script lang="ts">
	import { addWidgetAction } from '$lib/helpers/widget/actions'
	import { addWidgetData } from '$lib/helpers/widget/data'
	import { getData } from '$lib/services/getData'
	import { getContext, onMount } from 'svelte'

	let widget: any = getContext('widget')

	const url = $widget.query_slug.url
	const method = $widget.query_slug.method
	const body = $widget.query_slug.body

	let data: any
	let dataStore: any = getContext('widgetData')

	async function fetchData() {
		data = null
		data = getData(url, method)
		addWidgetData(dataStore, data)
	}

	let actionsStore: any = getContext('widgetActions')
	$: console.log('actionsStore', $widget.uid, $actionsStore)
	addWidgetAction(actionsStore, {
		name: 'reloadFetchData',
		action: () => fetchData()
	})

	onMount(() => {
		if (!$dataStore) {
			console.log('onMount fetching data', $widget.uid)
			fetchData()
		} else {
			console.log('onMount $dataStore', $widget.uid)
			data = $dataStore
		}
	})
</script>

{#await data}
	<p>loading</p>
{:then data}
	<slot {data} />
{/await}
