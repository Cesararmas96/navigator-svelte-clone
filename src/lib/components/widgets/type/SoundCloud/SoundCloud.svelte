<script lang="ts">
	import { SoundCloud } from 'sveltekit-embed'
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'

	const widget: any = getContext('widget')
	let soundcloudLink: string = ''

	async function loadMusic() {
		createMediaSettings(widget)

		const url = $widget?.url
		if (url.includes('on.soundcloud.com')) await resolveShortUrl(url)

		soundcloudLink = ''
		setTimeout(() => {
			console.log('Load soundcloud ID')
			soundcloudLink = url
		}, 5)
	}

	const resolveShortUrl = async (url: string) => {
		fetch(url)
			.then((r) => {
				if (!r.ok) {
					throw new Error(`HTTP error ${r.status}`)
				}
				for (const [key, value] of r.headers) {
					console.log(`${key}: ${value}`)
				}
				console.log(r.url)
			})
			.catch(console.error)
	}

	$: if ($widget?.saved) {
		loadMusic()
		$widget.saved = null
	}

	onMount(() => {
		loadMusic()
	})
</script>

{#if soundcloudLink}
	<SoundCloud {soundcloudLink} />
{/if}
