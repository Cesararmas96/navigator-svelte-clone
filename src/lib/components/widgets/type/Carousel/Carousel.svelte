<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import ImageGallery from '@react2svelte/image-gallery'
	import { browser } from '$app/environment'
	import { schema } from './setting'

	const widget: any = getContext('widget')
	let data: any = $widget.format_definition || []
	const props = {
		// lazyLoad: true,
		showFullscreenButton: true,
		showPlayButton: true,
		showBullets: true,
		showIndex: true,
		thumbnailPosition: 'left',
		autoPlay: true
	}

	$: if ($widget?.saved) {
		setTimeout(() => {
			data = $widget.format_definition
			createSettings()
		}, 5)

		$widget.saved = null
	}

	function createSettings() {
		const schemaLink = structuredClone(schema)
		schemaLink.$defs.format_definition.default = $widget?.format_definition
		$widget.schema = schemaLink
	}

	onMount(() => {
		createSettings()
	})
</script>

{#if browser && data.length > 0}
	<div class="w-full">
		<ImageGallery items={data} {...props} />
	</div>
{/if}
