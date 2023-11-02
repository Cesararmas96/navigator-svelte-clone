<script lang="ts">
	import { filterPrograms, sortPrograms } from '$lib/helpers/programs'
	import Loading from '$lib/components/common/Loading.svelte'
	import Card from '$lib/components/home/Card.svelte'
	import { storePrograms } from '$lib/stores/programs'
	import { storeUser } from '$lib/stores/session.js'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	export let data
	$storePrograms = data.programs
	$storeUser = data.user

	const allowedPrograms = sortPrograms(filterPrograms(data.programs, $storeUser.programs))

	// If there is only one program, redirect to it
	allowedPrograms.length === 1 && goto(`/${allowedPrograms[0].program_slug}`)

	let searchTerm = ''
	let filteredTemplates
	function filterCategories() {
		filteredTemplates = []
		searchTerm = searchTerm.toLowerCase()
		const aux = data.programs.filter((program) => {
			return program.program_name.toLowerCase().includes(searchTerm)
		})

		setTimeout(() => {
			filteredTemplates = [...aux]
		}, 5)
	}

	onMount(() => {
		filteredTemplates = data.programs.sort(function (program: any, program2: any) {
			return program.program_name.localeCompare(program2.program_name)
		})
	})
</script>

{#if filteredTemplates}
	<div class="flex flex-row justify-between px-4 sm:gap-5">
		<input
			type="text"
			class="form-control h-8 rounded-md bg-white/75 text-center text-base placeholder:text-muted dark:bg-dark-100/50 md:w-64 lg:w-96"
			placeholder="Start typing to search a program..."
			bind:value={searchTerm}
			on:input={filterCategories}
		/>
	</div>

	<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
		{#each filteredTemplates as program}
			<Card {program} />
		{/each}
	</ul>
{:else}
	<Loading />
{/if}
