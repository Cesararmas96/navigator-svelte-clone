<script lang="ts">
	export let data: string

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	let url: string

	$: {
		url = data
		if (url && !url.includes('https://') && !url.includes('http://')) {
			url = 'https://' + url
		}
	}
</script>

{#if url && url.match(patternUrl)}
	<!-- svelte-ignore a11y-missing-attribute -->
	<iframe src={url} />
{/if}
