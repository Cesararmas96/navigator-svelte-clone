<script lang="ts">
	import { Tweet } from 'sveltekit-embed'

	export let data: string

	let tweetLink: string
	$: tweetLink = data
</script>

{#if tweetLink}
	<Tweet {tweetLink} />
{/if}
