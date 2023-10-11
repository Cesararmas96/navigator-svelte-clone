<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import Spinner from '$lib/components/common/Spinner.svelte'
	import { addInstance, clearInstances } from '$lib/helpers/widget/instances'
	import { fnFormats } from '$lib/utils/formats'
	import { Tooltip } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let card: any

	const widget: Writable<any> = getContext('widget')
	let activeDrilldown: any

	$: drilldownOpen = $widget.instances
		.map((instance: any) => instance.uid)
		.includes(activeDrilldown?.uid)

	const fontColor = () => {
		// return card && card.color ? card.color : 'text-blue-500'
		return 'text-blue-500'
	}

	const handleClick = () => {
		if (drilldownOpen) return
		$widget.instance_loading = true
		clearInstances(widget)
		let drilldowns: any[] = card.drilldowns && Array.isArray(card.drilldowns) ? card.drilldowns : []
		drilldowns.forEach((drilldown: any) => {
			const drilldownConfig = Object.assign(
				{},
				{
					master_filtering: true,
					conditions:
						!drilldown!.extendConditions || drilldown!.extendConditions === 'false'
							? {}
							: $widget.conditions,
					dashboard_id: $widget.dashboard_id,
					module_id: $widget.module_id,
					program_id: $widget.program_id,
					widget_type_id: $widget.widget_type_id,
					parent: $widget.uid,
					dataExtra: drilldown!.dataExtra // TODO: investigar que es el dataExtra
				},
				drilldown,
				{
					params: {
						...drilldown.params,
						settings: $widget.params.settings
					}
				}
			)
			activeDrilldown = addInstance(widget, drilldownConfig)
			// if (
			//   drilldownOptions!.removeFields &&
			//   drilldownConfig.conditions &&
			//   drilldownConfig.conditions.fields
			// ) {
			//   delete drilldownConfig.conditions.fields
			// }
			// const vm = createVNode(WidgetComponent, {
			//   widget: drilldownConfig,
			// })
			// vm.appContext = currentInstance!.appContext
			// render(vm, containerWidget)
			// element[0].appendChild(containerWidget)
		})
	}

	$: isLoading = $widget.instance_loading && drilldownOpen

	const cardClass = `apiCard-content animate__animated animate__zoomIn card navigator-blue  ${
		card.class || 'navigator-blue'
	} h-full overflow-hidden rounded-md border border-light-200 p-6 py-3 hover:-translate-y-0.5 hover:scale-100 hover:shadow-lg dark:border-dark-200 dark:bg-[#22313a]`
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cardClass}
	class:cursor-pointer={card.drilldowns && !drilldownOpen}
	class:drilldown-open={drilldownOpen}
	on:click={handleClick}
>
	{#if isLoading}
		<Spinner fullScreen={false} />
	{/if}
	<div class="px-3">
		<div class="flex h-8 items-center justify-between">
			<div class={`mb-2 text-lg font-bold text-white ${fontColor}`}>
				{card.frontMask}
				{fnFormats(card.data, card.format)}
				{card.backMask}

				{#if card?.value && card?.value[1] && card?.values[card?.value[1]]}
					&nbsp; / &nbsp;
					{card.frontMask}
					{fnFormats(card?.values[card?.value[1]], card.format)}
					{card.backMask}
				{/if}
			</div>
			<Icon icon="tabler:chart-bar" size="28" />
		</div>
		<div class="text-lg font-bold">{card.title}</div>
		{#if card?.footer}
			<div class="text-gray-50">{card.footer}</div>
		{/if}
	</div>
</div>
{#if card.drilldowns && !drilldownOpen}
	<Tooltip placement="top">Click for details</Tooltip>
{/if}

<style>
	.drilldown-open {
		transform: translateY(-4px);
		box-shadow: 0 0 9px 0 rgb(0 0 0 / 90%) !important;
		transition: all 0.3s;
		background-color: #000000 !important;
	}
</style>
