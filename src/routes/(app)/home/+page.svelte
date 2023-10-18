<script lang="ts">
	import Card from '$lib/components/home/Card.svelte'
	import { storePrograms } from '$lib/stores/programs'
	import { storeUser } from '$lib/stores/session.js'

	export let data

	$storePrograms = data.programs
	$storeUser = data.user

	const allPrograms = data.programs.sort(function (program: any, program2: any) {
		return program.program_name.localeCompare(program2.program_name)
	})
</script>

{#if data.programs}
	<ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
		{#each allPrograms as program}
			<Card {program} />
		{/each}
	</ul>
{/if}
