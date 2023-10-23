<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Button } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'
	import Filter from './Filter.svelte'

	const dispatch = createEventDispatcher()

	export let position: string
	export let widgetID: string
	export let btnsActions: any
	export let filterCallback: ((inputId: string) => void) | undefined = undefined

	const buttons =
		btnsActions && btnsActions[position]
			? Object.entries(btnsActions[position]).map(([key, value]: [string, any]) => value)
			: []

	const handleClick = (method: string) => {
		dispatch('click', method)
	}
</script>

<div id={`aggrid-toolbar-${widgetID}-${position}`} class="flex flex-row justify-between">
	{#if filterCallback}
		<Filter {filterCallback} />
	{/if}
	<div
		class={'widget-toolbar flex w-full flex-row justify-end px-3 py-3'}
		class:hidden={buttons.length === 0}
	>
		{#each buttons as btn}
			<Button
				class={btn.class}
				variant="primary"
				size="sm"
				on:click={() => handleClick(btn.method)}
			>
				<Icon icon={btn.icon} />
				{btn.title}
			</Button>
		{/each}
	</div>
</div>
