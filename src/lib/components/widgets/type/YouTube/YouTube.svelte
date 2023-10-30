<script lang="ts">
	import { YouTube } from 'sveltekit-embed'
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')
	const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	let youTubeId: string = ''

	$: {
		const match = $widget?.url.match(regExp)

		youTubeId = ''
		setTimeout(() => {
			console.log('Load youtube ID')
			youTubeId = match && match[2].length == 11 ? match[2] : ''
		}, 5)
	}
</script>

{#if youTubeId}
	<YouTube {youTubeId} />
{/if}
