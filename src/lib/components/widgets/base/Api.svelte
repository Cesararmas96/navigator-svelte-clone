<script lang="ts">
	import { getData } from '$lib/services/getData'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const url = import.meta.env.VITE_API_URL
	const slug = $widget.data.query_slug.slug
	const method = $widget.data.params.ajax.method || $widget.data.params.ajax.type

	async function fetchData() {
		const res = await getData(`${url}/${slug}`, method)
		return res
	}
</script>

{#await fetchData()}
	<p>loading</p>
{:then data}
	<slot {data} />
{/await}
