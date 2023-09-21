<script lang="ts">
	import { Spotify } from 'sveltekit-embed'

	export let data: string

	// const regExp =
	// 	/(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/

	const regExp = /(https?:\/\/open.spotify.com\/(track|user|artist|album|playlist)\/([^#\&\?]*))/

	let spotifyLink: string = ''

	$: {
		let url = data
		const match = url.match(regExp)
		spotifyLink = match ? match[2] + '/' + match[3] : ''
		console.log(match, spotifyLink)
	}
</script>

{#if spotifyLink}
	<Spotify {spotifyLink} />
{/if}
