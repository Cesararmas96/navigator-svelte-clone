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
</script>

{#if $openModal}
	<Modal
		title={$openModal.props.title}
		size={$openModal.props?.size || 'xs'}
		bind:open={$openModal}
		autoclose
		outsideclose
		defaultClass="relative flex flex-col border rounded-lg	"
	>
		<span class="my-4">
			{#await Thing()}
				Loading...
			{:then component}
				<svelte:component this={component} props={$openModal.props} />
			{/await}
		</span>
	</Modal>
{/if}
