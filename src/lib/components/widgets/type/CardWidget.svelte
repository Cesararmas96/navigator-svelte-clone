<script lang="ts">
	import Card from './CardWidget/Card.svelte'
	import { fnFormats } from '$lib/utils/formats'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
	export let data: any
	$: {
		buildCards()
	}

	let cards: any[] = []
	const trendcard = {}
	const format_definition =
		$widget.params.card &&
		$widget.params.card.cards &&
		Object.keys($widget.params.card.cards).length > 0 // Old version
			? $widget.params.card.cards
			: $widget.format_definition && Object.keys($widget.format_definition).length > 0 // New version
			? $widget.format_definition
			: {}

	function buildCards() {
		const values = data ? data[0] : []

		Object.keys(values).map((card, cardIndex) => {
			let configExtend = (format_definition && format_definition[card]) || {}

			if (!configExtend.hidden) {
				// if ($widget.params.card && $widget.params.card.type === 'trend-card') {
				// 	$widget.trendcard![card] = {}
				// 	// configExtend = generateTrendCard(card, configExtend)
				// }

				cards.push({
					uid: card,
					title: fnFormats(card, 'toUpperCase'),
					data: values[card],
					order: cardIndex,
					icon: 'tabler-brand-google-analytics',
					col:
						$widget.params.card && $widget.params.card.colspan
							? $widget.params.card.colspan
							: $widget.params.cols || 12,
					format: 'fnFormatNumberOne',
					frontMask: '',
					backMask: '',
					...configExtend
				})
			}
		})
	}
</script>

{#if data}
	<div class="grid grid-cols-12 gap-3">
		{#each cards as card}
			<div style:grid-column={`span ${card.col} / span ${card.col}`} class="my-2">
				<Card {card} />
			</div>
		{/each}
	</div>
{/if}
