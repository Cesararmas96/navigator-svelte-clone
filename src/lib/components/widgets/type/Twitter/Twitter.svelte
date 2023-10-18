<script lang="ts">
	import { Tweet } from 'sveltekit-embed'

	export let data: Record<string, any>

	let tweetLink: string
	$: tweetLink = data?.url
</script>

{#if tweetLink}
	<Tweet {tweetLink} />
{/if}
