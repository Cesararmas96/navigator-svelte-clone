<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Button } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import AgGridFilter from './AgGridFilter.svelte'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'
	import AgGridFilterSelector from './AgGridFilterSelector.svelte'

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	export let position: string
	export let widgetID: string
	export let btnsActions: any
	export let filterCallback: string | undefined = undefined
	export let selectorCallback: string | undefined = undefined
	export let btnCallback: string | undefined = undefined

	const fCallback = filterCallback ? getWidgetAction($widgetActions, filterCallback) : null
	const sCallback = selectorCallback ? getWidgetAction($widgetActions, selectorCallback) : null
	const bCallback = btnCallback ? getWidgetAction($widgetActions, btnCallback) : null

	const buttons =
		btnsActions && btnsActions[position]
			? Object.entries(btnsActions[position]).map(([key, value]: [string, any]) => value)
			: []
</script>

<div id={`aggrid-toolbar-${widgetID}-${position}`} class="flex flex-row justify-between">
	{#if fCallback}
		<AgGridFilter filterCallback={fCallback.action} />
	{/if}
	{#if sCallback}
		<AgGridFilterSelector selectorCallback={sCallback.action} />
	{/if}
	<div
		class={'widget-toolbar flex w-full flex-row justify-end px-3 py-3 '}
		class:hidden={buttons.length === 0}
	>
		{#each buttons as btn}
			<Button
				class="{btn.class} hover:bg-darken "
				variant="primary"
				size="sm"
				on:click={() => bCallback.action(btn.method)}
			>
				<Icon icon={btn.icon} />
				<span class="ml-1 text-base">{btn.title}</span>
			</Button>
		{/each}
	</div>
</div>
