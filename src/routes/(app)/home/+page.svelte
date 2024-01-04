<script lang="ts">
	import Dropdown from '$lib/components/common/Dropdown.svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import Loading from '$lib/components/common/Loading.svelte'
	import Card from '$lib/components/home/Card.svelte'
	import { storePrograms } from '$lib/stores/programs'
	import { storeUser } from '$lib/stores/session.js'
	import { Input } from 'flowbite-svelte'
	import { onMount } from 'svelte'

	export let data
	$storePrograms = data.programs
	$storeUser = data.user

	const types = data.programType.map((type) => {
		return {
			label: type.name,
			value: type.id
		}
	})
	let selectedValue

	let searchTerm = ''
	let filteredTemplates
	function filterCategories() {
		filteredTemplates = []
		searchTerm = searchTerm.toLowerCase()
		const aux = data.programs.filter((program) => {
			return (
				program.program_name.toLowerCase().includes(searchTerm) &&
				(!selectedValue || program.program_type_id == selectedValue)
			)
		})

		setTimeout(() => {
			filteredTemplates = [...aux]
		}, 5)
	}

	onMount(() => {
		filteredTemplates = data.programs.sort(function (program: any, program2: any) {
			return program.program_id - program2.program_id
		})
	})
</script>

{#if filteredTemplates}
	<div class="flex items-center justify-start px-4 md:flex-col lg:w-[40%] lg:flex-row lg:gap-x-4">
		<Dropdown
			items={types}
			defaultClass="text-base w-72"
			labelClass="mb-0"
			showSearch={false}
			{selectedValue}
			placeholder={'All Categories'}
			on:change={(e) => {
				selectedValue = e.detail.value
				filterCategories()
			}}
		/>
		<Input
			type="text"
			size="md"
			class="form-control rounded bg-white/75 p-2 pl-8 text-base placeholder:text-muted dark:bg-dark-100/50 "
			placeholder="Start typing to search a program..."
			bind:value={searchTerm}
			on:input={filterCategories}
		>
			<Icon icon={'tabler:search'} slot="left" size="18" />
			<Icon
				icon={'typcn:delete'}
				slot="right"
				size="18"
				classes={'cursor-pointer'}
				on:click={() => {
					searchTerm = ''
					filterCategories()
				}}
			/>
		</Input>
	</div>

	{#if filteredTemplates.length > 0}
		<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
			{#each filteredTemplates as program}
				<Card {program} />
			{/each}
		</ul>
	{:else}
		<div class="flex h-64 flex-col items-center justify-center">
			<h1 class="text-3xl text-gray-500 dark:text-gray-400">No programs available</h1>
		</div>
	{/if}
{:else}
	<Loading />
{/if}
