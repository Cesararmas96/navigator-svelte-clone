<script lang="ts">
	import { YouTube } from 'sveltekit-embed'
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	let youTubeId: string = ''

	function loadVideo() {
		createMediaSettings(widget)

		const match = $widget?.url.match(regExp)

		youTubeId = ''
		setTimeout(() => {
			console.log('Load youtube ID')
			youTubeId = match && match[2].length == 11 ? match[2] : ''
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

{#if youTubeId}
	<YouTube {youTubeId} />
{/if}
