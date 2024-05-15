<script lang="ts">
	import SimpleCard from './SimpleCard.svelte'
	import { fnFormats } from '$lib/utils/formats'
	import { getContext, onMount } from 'svelte'
	import { sortBy } from 'lodash-es'

	export let data: any

	const widget: any = getContext('widget')

	$: if (data) {
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
		cards = []
		let cardsTemp: any[] = []
		const values = data ? data[0] : []
		Object.keys(values).map((card, cardIndex) => {
			let configExtend = (format_definition && format_definition[card]) || {}

			if (!configExtend.hidden) {
				// if ($widget.params.card && $widget.params.card.type === 'trend-card') {
				// 	$widget.trendcard![card] = {}
				// 	// configExtend = generateTrendCard(card, configExtend)
				// }

				cardsTemp.push({
					uid: card,
					title: fnFormats(card, 'toUpperCase'),
					data: values[card],
					order: cardIndex,
					icon: configExtend?.icon || 'tabler-brand-google-analytics',
					col:
						$widget.params.card && $widget.params.card.colspan
							? $widget.params.card.colspan
							: $widget.params.cols || 12,
					format: 'fnFormatNumberOne',
					frontMask: '',
					backMask: '',
					values: values,
					...configExtend
				})
			}

			cards = sortBy(cardsTemp, 'order')
		})
	}

	onMount(() => {
		// if ($dashboard?.attributes?.explorer === 'v2') {
		// 	console.log('resizeAction')
		// 	resizeAction.action()
		// }
	})
</script>

{#if data}
	<div class="mt-1 grid grid-cols-12 gap-1">
		{#each cards as card}
			<div style:grid-column={`span ${card.col} / span ${card.col}`}>
				<SimpleCard {card} />
			</div>

			{#if card.jump}
				<div class="col-span-12" />
			{/if}
		{/each}
	</div>
{/if}
