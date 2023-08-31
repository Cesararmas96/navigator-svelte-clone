<script lang="ts">
	import { getData } from '$lib/services/getData'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	let widgetActions: any = getContext('widgetActions')

	const url = $widget.query_slug.url
	const method = $widget.query_slug.method
	const body = $widget.query_slug.body

	let data: any
	async function fetchData() {
		data = getData(url, method)
	}

	if (!$widgetActions.find((action: any) => action.name === 'reloadFetchData')) {
		const actions = $widgetActions
		actions.push({
			name: 'reloadFetchData',
			action: () => fetchData()
		})
		$widgetActions = actions
	}

	fetchData()
</script>

{#await data}
	<p>loading</p>
{:then data}
	<slot {data} />
{/await}
