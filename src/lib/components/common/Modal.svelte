<script lang="ts">
	import { modal } from '$lib/helpers/common/modal'
	import { Modal } from 'flowbite-svelte'
	import { onDestroy } from 'svelte'
	import type { Writable } from 'svelte/store'

	// const openModal = getContext<Writable<any>>('modal')
	const openModal: Writable<any> = modal
	let Thing: any
	$: Thing = async () => {
		return (await import(`../modals/${$openModal.component}.svelte`)).default
	}
	$: size = $openModal?.props?.size || 'xs'
</script>

{#if $openModal}
	<Modal title={$openModal.props.title} {size} bind:open={$openModal} autoclose outsideclose>
		<span class="space-y-3">
			{#await Thing()}
				Loading...
			{:then component}
				<svelte:component this={component} props={$openModal.props} />
			{/await}
		</span>
	</Modal>
{/if}
