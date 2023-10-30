<script lang="ts">
	import { Spotify } from 'sveltekit-embed'
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	const regExp = /(https?:\/\/open.spotify.com\/(track|user|artist|album|playlist)\/([^#\&\?]*))/
	let spotifyLink: string = ''

	function loadMusic() {
		createMediaSettings(widget)

		const match = $widget?.url.match(regExp)

		spotifyLink = ''
		setTimeout(() => {
			console.log('Load Spotify ID')
			spotifyLink = match ? match[2] + '/' + match[3] : ''
		}, 5)
	}

	$: if ($widget?.saved) {
		loadMusic()
		$widget.saved = null
	}

	onMount(() => {
		loadMusic()
	})
</script>

{#if spotifyLink}
	<Spotify {spotifyLink} />
{/if}
