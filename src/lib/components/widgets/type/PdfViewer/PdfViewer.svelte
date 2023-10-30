<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	let url: string = ''

	function loadPDF() {
		createMediaSettings(widget)

		url = $widget.url
	}

	$: if ($widget?.saved) {
		loadPDF()
		$widget.saved = null
	}

	onMount(() => {
		loadPDF()
	})
</script>

<iframe title="PDF Viewer" src={url} style="width: 100%; min-height: 800px" frameborder="0" />
