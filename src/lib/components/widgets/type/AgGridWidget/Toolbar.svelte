<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Button } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let position: string
	export let btnsActions: any

	const buttons =
		btnsActions && btnsActions[position]
			? Object.entries(btnsActions[position]).map(([key, value]: [string, any]) => value)
			: []

	const handleClick = (method: string) => {
		dispatch('click', method)
	}
</script>

<div class={'flex w-full flex-row justify-end px-3 py-3'} class:hidden={buttons.length === 0}>
	{#each buttons as btn}
		<Button class={btn.class} variant="primary" size="sm" on:click={() => handleClick(btn.method)}>
			<Icon icon={btn.icon} />
			{btn.title}
		</Button>
	{/each}
</div>
