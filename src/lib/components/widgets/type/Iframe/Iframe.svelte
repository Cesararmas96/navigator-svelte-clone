<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	let url: string = ''

	function loadIframe() {
		createMediaSettings(widget)

		url = $widget.url
	}

	$: if ($widget?.saved) {
		loadIframe()
		$widget.saved = null
	}

	onMount(() => {
		loadIframe()
	})
</script>

<iframe src={url} title={$widget.title} class="h-full w-full" />
