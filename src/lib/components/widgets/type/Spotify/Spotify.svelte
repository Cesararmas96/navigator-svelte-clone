<script lang="ts">
	import { Spotify } from 'sveltekit-embed'
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')
	const regExp = /(https?:\/\/open.spotify.com\/(track|user|artist|album|playlist)\/([^#\&\?]*))/
	let spotifyLink: string = ''

	$: {
		let url = $widget?.url
		spotifyLink = ''
		const match = url.match(regExp)
		setTimeout(() => {
			console.log('Load Spotify')
			spotifyLink = match ? match[2] + '/' + match[3] : ''
		}, 10)
	}
</script>

{#if spotifyLink}
	<Spotify {spotifyLink} />
{/if}
