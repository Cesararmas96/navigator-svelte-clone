<script lang="ts">
	import { Label, DropdownItem, Dropdown, Input } from 'flowbite-svelte'
	import Icon from './Icon.svelte'
	import { createEventDispatcher } from 'svelte'

	interface Item {
		value: string | number
		label: string
	}

	const dispatch = createEventDispatcher()

	export let items: Item[] = []
	export let selectedValue: string = ''
	export let defaultClass: string = 'mb-3'
	export let label: string = ''

	let selected: string | undefined

	if (selectedValue) selected = items.find((item: Item) => item.value === selectedValue)?.label

	let dropdownOpen = false

	const handleClick = (e: any, item: Item) => {
		e.preventDefault()
		dropdownOpen = false
		selected = item.label
		console.log(item)
		dispatch('change', item)
	}
</script>

<div class={defaultClass}>
	{#if label}<Label for="type" class="mb-2 block text-left">{label}</Label>{/if}
	<Input
		id="type"
		placeholder="Choose option ..."
		size="sm"
		defaultClass="py-1 px-2 w-full !rounded"
		autocomplete="off"
		readonly
		bind:value={selected}
	>
		<Icon icon="mdi:chevron-down" slot="right" size="18" />
	</Input>
	<Dropdown bind:open={dropdownOpen} placement="bottom-start">
		{#each items as item}
			<DropdownItem on:click={(e) => handleClick(e, item)}>{item.label}</DropdownItem>
		{/each}
	</Dropdown>
</div>
