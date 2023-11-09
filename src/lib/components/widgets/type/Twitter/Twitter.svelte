<script lang="ts">
	import { Tweet } from 'sveltekit-embed'
	import { getContext, onMount } from 'svelte'
	import { createMediaSettings } from '../../base/settings/media'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'

	const widget: any = getContext('widget')
	let tweetLink: string

	function loadTweet() {
		createMediaSettings(widget)

		tweetLink = ''
		setTimeout(() => {
			console.log('Load twitter ID')
			tweetLink = $widget?.url
		}, 5)
	}

	$: if ($widget?.saved) {
		loadTweet()
		$widget.saved = null
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	onMount(() => {
		loadTweet()
		const resizeAction = getWidgetAction($widgetActions, 'resize')
		resizeAction.action()
	})
</script>

{#if tweetLink}
	<Tweet {tweetLink} />
{/if}
