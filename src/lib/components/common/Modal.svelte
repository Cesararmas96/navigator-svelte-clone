<script lang="ts">
	import { Modal } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	const openModal = getContext<Writable<any>>('modal')
	let Thing: any

	$: Thing = async () => {
		return (await import(`../modals/${$openModal.component}.svelte`)).default
	}
</script>

{#if $openModal}
	<Modal
		title={$openModal.title}
		size="xs"
		bind:open={$openModal}
		on:close={() => ($openModal = null)}
	>
		<p class="text-sm font-normal text-gray-500 dark:text-gray-400" />
		<span class="my-4 space-y-3">
			{#await Thing()}
				Loading...
			{:then component}
				<svelte:component this={component} />
			{/await}
		</span>
	</Modal>
{/if}

<!-- {Thing} -->
