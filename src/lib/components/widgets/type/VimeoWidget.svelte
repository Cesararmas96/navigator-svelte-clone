<script lang="ts">
	import { Vimeo } from 'sveltekit-embed'

	export let data: string

	const regExp =
		/(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:video\/|embed\/|watch\?\S*v=|v\/)?(\d*)/

	let vimeoId: string = ''

	$: {
		let url = data
		const match = url.match(regExp)
		vimeoId = match && match[1] ? match[1] : ''
	}
</script>

{#if vimeoId}
	<Vimeo {vimeoId} />
{/if}
