<script lang="ts">
	import { SoundCloud } from 'sveltekit-embed'

	export let data: string

	let soundcloudLink: string = ''

	$: async () => {
		let url = data
		if (url.includes('on.soundcloud.com')) await resolveShortUrl(url)

		soundcloudLink = url
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
</script>

{#if soundcloudLink}
	<SoundCloud {soundcloudLink} />
{/if}
