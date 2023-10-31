<script lang="ts">
	import { Vimeo } from 'sveltekit-embed'
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	const regExp =
		/(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:video\/|embed\/|watch\?\S*v=|v\/)?(\d*)/

	let vimeoId: string = ''

	function loadVideo() {
		createMediaSettings(widget)

		const match = $widget?.url.match(regExp)

		vimeoId = ''
		setTimeout(() => {
			console.log('Load vimeo ID')
			vimeoId = match && match[1] ? match[1] : ''
		}, 5)
	}

	$: if ($widget?.saved) {
		loadVideo()
		$widget.saved = null
	}

	onMount(() => {
		loadVideo()
	})
</script>

{#if vimeoId}
	<Vimeo {vimeoId} />
{/if}
