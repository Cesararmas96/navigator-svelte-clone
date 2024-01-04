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
	export let reset: boolean = false
	export let disabled: boolean = false

	const id = generateUID()

	let selected: string | undefined
	let searchTerm = ''

	let dropdownOpen = false

	let filterdItems: any = []
	let loadedItems: any[] = []
	let isLoading = false
	let loadMoreThreshold = 10

	const handleClick = (e: any, item: Item) => {
		e.preventDefault()
		dropdownOpen = false
		selected = item.label
		dispatch('change', item)
	}

	const searchTermChange = (e: any) => {
		searchTerm = e.target.value
		filterItems(searchTerm)
	}

	const loadMoreItems = async (reset: boolean = false) => {
		if (isLoading) return
		isLoading = true

		if (reset) loadedItems = []

		const lastElement =
			loadedItems.length + loadMoreThreshold > filterdItems.length
				? filterdItems.length
				: loadedItems.length + loadMoreThreshold

		const newItems = filterdItems.slice(loadedItems.length, lastElement)
		loadedItems = [...loadedItems, ...newItems]

		isLoading = false
	}

	const onDropdownScroll = (event) => {
		const target = event.target
		if (target.scrollHeight - target.scrollTop <= target.clientHeight + 30) loadMoreItems()
	}

	const activeScroll = () => {
		setTimeout(() => {
			const ddScroll = document.getElementsByClassName('dropdown-scroll')[0]
			if (dropdownOpen) ddScroll?.addEventListener('scroll', onDropdownScroll)
			else ddScroll?.removeEventListener('scroll', onDropdownScroll)
			filterItems(searchTerm)
		}, 10)
	}

	const filterItems = (term: string) => {
		if (!items) return
		filterdItems =
			term !== ''
				? items.filter((item: Item) => item.label.toLowerCase().includes(term.toLowerCase()))
				: [...items]
		loadMoreItems(true)
	}

	$: if (selectedValue) {
		selected = items.find((item: Item) => item.value === selectedValue)?.label
		if (!selected) selected = placeholder
	} else {
		selected = placeholder
	}

	$: if (reset) {
		selected = placeholder
		reset = false
	}
</script>

<div class="relative flex flex-col {defaultClass}">
	{#if label}<Label for="dd-input-{id}" class="block text-left {labelClass}">{label}</Label>{/if}
	<Input
		id="dd-input-{id}"
		size="md"
		defaultClass="py-1 !text-base h-9 px-2 w-full !rounded cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-dark-200"
		autocomplete="off"
		readonly
		value={selected}
		{disabled}
	>
		<Icon
			icon={!dropdownOpen ? 'mdi:chevron-down' : 'mdi:chevron-up'}
			slot="right"
			size="18"
			classes={!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}
		/>
	</Input>
	{#if !disabled}
		<Dropdown
			bind:open={dropdownOpen}
			on:show={activeScroll}
			placement="bottom-start"
			class={`${showScroll ? 'dropdown-scroll h-44 overflow-y-auto' : 'dropdown-scroll'}`}
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
			{#each loadedItems as item}
				<DropdownItem
					defaultClass="w-full min-w-[200px] px-2 py-1 hover:bg-gray-100"
					on:click={(e) => handleClick(e, item)}>{item.label}</DropdownItem
				>
			{/each}
		</Dropdown>
	{/if}
</div>
