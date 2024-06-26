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
		.map((instance: any) => instance.widget_id)
		.includes(activeDrilldown?.widget_id)

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
					parent: $widget.widget_id,
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

	const cardClass = ` animate__animated animate__zoomIn card  ${
		card.class || 'apiCard-content'
	} h-full overflow-hidden rounded-md border border-light-200 py-3 hover:-translate-y-0.5 hover:scale-100 hover:shadow-lg dark:border-dark-200 dark:bg-[#22313a]`
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cardClass}
	class:card-hover={card.drilldowns && !drilldownOpen}
	class:cursor-pointer={card.drilldowns && !drilldownOpen}
	class:drilldown-open={drilldownOpen}
	on:click={handleClick}
>
	{#if isLoading}
		<Spinner fullScreen={false} />
	{/if}
	<div class="px-3">
		<div class="mt-1 flex h-8 items-center justify-between">
			<div class={`mb-4  text-3xl font-semibold text-white ${fontColor}`}>
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
			<Icon icon={card.icon} size="28" />
		</div>
		<div class="mb-0 font-semibold">{card.title}</div>
		{#if card?.footer}
			<div class="font-normal text-gray-50">{card.footer}</div>
		{/if}
	</div>
	{#if card.drilldowns && !drilldownOpen}
		<div class="card-hover-message">Click for details</div>
	{/if}
</div>

<!-- {#if card.drilldowns && !drilldownOpen}
	<Tooltip defaultClass="py-2 px-3 text-sm font-medium z-50">Click for details</Tooltip>
{/if} -->

<!-- {#if card.drilldowns && !drilldownOpen}
	<div class="relative left-5 top-5">Click for details</div>
{/if} -->

<style>
	.drilldown-open {
		transform: translateY(-4px);
		box-shadow: 0 0 9px 0 rgb(0 0 0 / 90%) !important;
		transition: all 0.3s;
		background-color: #000000 !important;
	}

	.card-hover {
		position: relative;
		transition: background-color 0.3s;
	}

	.card-hover-message {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 10px;
		border-radius: 8px;
		z-index: 10;
		padding: 10px 20px;
		text-align: center;
	}

	.card-hover:hover .card-hover-message {
		display: block;
	}
</style>
