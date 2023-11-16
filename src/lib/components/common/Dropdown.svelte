<script lang="ts">
	import { Label, DropdownItem, Dropdown, Input, Search } from 'flowbite-svelte'
	import Icon from './Icon.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import { generateUID } from '$lib/helpers/common/common'

	interface Item {
		value: string | number
		label: string
	}

	const dispatch = createEventDispatcher()

	export let items: Item[] = []
	export let selectedValue: string = ''
	export let defaultClass: string = 'mb-3'
	export let labelClass: string = 'mb-2'
	export let label: string = ''
	export let placeholder: string = 'Select an option...'
	export let showSearch: boolean = true
	export let showScroll: boolean = true

	const id = generateUID()

	let selected: string | undefined
	let searchTerm = ''

	if (selectedValue) selected = items.find((item: Item) => item.value === selectedValue)?.label

	let dropdownOpen = false

	const handleClick = (e: any, item: Item) => {
		e.preventDefault()
		dropdownOpen = false
		selected = item.label
		dispatch('change', item)
	}

	const searchTermChange = (e: any) => {
		searchTerm = e.target.value
	}

	$: filterdItems = items.filter((item: Item) =>
		item.label.toLowerCase().includes(searchTerm.toLowerCase())
	)
</script>

<div class="relative flex flex-col {defaultClass}">
	{#if label}<Label for="input-{id}" class="block text-left {labelClass}">{label}</Label>{/if}
	<Input
		id="input-{id}"
		{placeholder}
		size="md"
		defaultClass="py-1 px-2 w-full !rounded cursor-pointer"
		autocomplete="off"
		readonly
		bind:value={selected}
	>
		<Icon icon="mdi:chevron-down" slot="right" size="18" classes="cursor-pointer" />
	</Input>

	<Dropdown
		bind:open={dropdownOpen}
		placement="bottom-start"
		class={`${showScroll ? 'h-44 overflow-y-auto' : ''}`}
		containerClass="w-full z-50 divide-y"
	>
		<div slot="header" class:p-3={showSearch}>
			{#if showSearch}
				<Search size="md" class="round-md" bind:searchTerm on:input={searchTermChange} />
			{/if}
		</div>
		<DropdownItem
			defaultClass="w-full min-w-[200px] px-2 py-1 hover:bg-gray-100"
			on:click={(e) => handleClick(e, { value: '', label: placeholder })}
			>{placeholder}</DropdownItem
		>
		{#each filterdItems as item}
			<DropdownItem
				defaultClass="w-full min-w-[200px] px-2 py-1 hover:bg-gray-100"
				on:click={(e) => handleClick(e, item)}>{item.label}</DropdownItem
			>
		{/each}
	</Dropdown>
</div>
