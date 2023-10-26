<script lang="ts">
	import { YouTube } from 'sveltekit-embed'

	export let data: Record<string, any>

	const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/

	let youTubeId: string = ''

	$: {
		let url = data?.url
		console.log(url)
		console.log('ACAAAA')
		const match = url.match(regExp)
		youTubeId = match && match[2].length == 11 ? match[2] : ''
	}
</script>

{#if youTubeId}
	<YouTube {youTubeId} />
{/if}
