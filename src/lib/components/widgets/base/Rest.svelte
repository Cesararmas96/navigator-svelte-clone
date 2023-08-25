<script lang="ts">
	import { getData } from '$lib/services/getData'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
	const url = $widget.data.query_slug.url
	const method = $widget.data.query_slug.method
	const body = $widget.data.query_slug.body

	async function fetchData() {
		return await getData(url, method)
	}

	async function refresh() {
		console.log('refreshing')
	}
	async function filter() {
		console.log('filtering')
	}

	const methods = ['refresh', 'filter']
</script>

{#await fetchData()}
	<p>loading</p>
{:then data}
	<slot {data} {methods} />
{/await}
