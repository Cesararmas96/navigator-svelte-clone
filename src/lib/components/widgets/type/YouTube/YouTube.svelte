<script lang="ts">
	import { YouTube } from 'sveltekit-embed'
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')
	const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	let youTubeId: string = ''

	$: {
		let url = $widget?.url
		youTubeId = ''
		const match = url.match(regExp)
		setTimeout(() => {
			console.log('Load youtube ID')
			youTubeId = match && match[2].length == 11 ? match[2] : ''
		}, 5)
	}
</script>

{#if youTubeId}
	<YouTube {youTubeId} />
{/if}
