<script lang="ts">
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')
	let url: string = $widget?.url || ''

	$: if (url !== $widget?.url) {
		url = $widget.url
	}
</script>

<iframe title="PDF Viewer" src={url} style="width: 100%; min-height: 800px" frameborder="0" />
