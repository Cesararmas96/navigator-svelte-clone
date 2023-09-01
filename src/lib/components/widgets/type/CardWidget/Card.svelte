<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { fnFormats } from '$lib/utils/formats'

	export let card: any

	const fontColor = () => {
		// return card && card.color ? card.color : 'text-blue-500'
		return 'text-blue-500'
	}
</script>

<div
	class="apiCard-content animate__animated animate__zoomIn card navigator-blue cursor-pointer overflow-hidden rounded-md border border-light-200 p-6 py-3 hover:-translate-y-1 hover:scale-100 hover:shadow-lg dark:border-dark-200 dark:bg-[#22313a]"
>
	<div class="px-3">
		<div class="flex h-8 items-center justify-between">
			<div class={`mb-2 text-lg font-bold text-white ${fontColor}`}>
				{card.frontMask}
				{fnFormats(card.data, card.format)}
				{card.backMask}
			</div>

			<Icon icon="tabler:chart-bar" size="28" />
		</div>
		<div class="text-lg font-bold">{card.title}</div>
		{#if card?.footer}
			<div class="text-gray-50">{card.footer}</div>
		{/if}
	</div>
</div>
