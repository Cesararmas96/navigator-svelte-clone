<script lang="ts">
	import { Button, Dropdown, DropdownItem, Search } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let icon: string

	const prefix = 'tabler'

	let dropdownOpen = false
	let inputValue = ''
	let icons: string[] = []

	let page: any

	let currentPage = 1
	const perPage = 20

	const paginate = (page = 1, search = '') => {
		const tempIcons =
			search && search.length > 1
				? icons.filter((icon) => icon.includes(inputValue.toLowerCase()))
				: icons

		const offset = perPage * (page - 1)
		const totalPages = Math.ceil(tempIcons.length / perPage)
		const paginatedItems = tempIcons.slice(offset, perPage * page)

		return {
			previousPage: page - 1 ? page - 1 : null,
			nextPage: totalPages > page ? page + 1 : null,
			total: tempIcons.length,
			totalPages: totalPages,
			items: paginatedItems
		}
	}

	$: page = paginate(currentPage, inputValue)

	onMount(async () => {
		icons = await fetch(`https://api.iconify.design/collection?prefix=${prefix}&pretty=1`)
			.then((response) => response.json())
			.then((data) => {
				return data.uncategorized
			})

		page = paginate(currentPage)
	})

	const handleClick = (e: any, icon: string) => {
		e.preventDefault()
		dropdownOpen = false
		dispatch('click', prefix + ':' + icon)
	}
</script>

<Button class="btnIcon align-center flex w-fit flex-row" size="sm">
	<Icon {icon} size="18" classes="mr-1 text-white dark:text-white" />
	<Icon icon="heroicons:chevron-down-solid" size="18" classes="ml-2 text-white dark:text-white" />
</Button>
<Dropdown
	placement="bottom-start"
	triggeredBy=".btnIcon"
	class="grid grid-cols-5 px-3 py-0 text-sm"
	containerClass=" z-50 card shadow-xl dark:bg-gray-800 dark:text-white"
	bind:open={dropdownOpen}
>
	<div slot="header" class="px-3 pb-1">
		<Search size="md" bind:value={inputValue} />
	</div>
	{#each page.items as icon}
		<DropdownItem
			on:click={(e) => handleClick(e, icon)}
			class="space-x-4 justify-self-center rounded p-2 text-center"
		>
			<Icon icon={'tabler:' + icon} size="24" classes="text-black dark:text-white" />
		</DropdownItem>
	{/each}
	<div slot="footer">
		<div class="align-center flex flex-row justify-between px-3 py-2">
			<Button class="align-center p-2" size="sm" on:click={() => (currentPage = page.previousPage)}>
				<Icon icon="mdi:arrow-left" size="18" classes="text-white dark:text-white" />
			</Button>
			<div class="flex flex-col justify-center">
				{currentPage} - {page.totalPages} of {page.total}
			</div>
			<Button class="align-center p-2" size="sm" on:click={() => (currentPage = page.nextPage)}>
				<Icon icon="mdi:arrow-right" size="18" classes="text-white dark:text-white" />
			</Button>
		</div>
	</div>
</Dropdown>
