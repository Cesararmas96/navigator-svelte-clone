<script lang="ts">
	import { Button } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { modal } from '$lib/helpers/common/modal'

	const modalTypeIcon = {
		warning: 'tabler:alert-circle',
		info: 'tabler:info-circle',
		success: 'tabler:circle-check',
		error: 'tabler:circle-x'
	}

	type ModalType = 'warning' | 'info' | 'success' | 'error'

	export let props: {
		title?: string
		description: string
		type: ModalType
		confirmCallback: () => void
		confirmButtonText?: string
		hideCancelButton?: boolean
		cancelButtonText?: string
	}
</script>

<div class="text-center">
	<Icon icon={modalTypeIcon[props.type]} size="60px" classes={`icon-color-${props.type}`} />
	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		{@html props.description}
	</h3>
	<Button color="primary" class="mr-2" on:click={props.confirmCallback}
		>{props.confirmButtonText || 'Ok'}</Button
	>
	{#if !props.hideCancelButton}
		<Button color="alternative" on:click={() => ($modal = false)}
			>{props.cancelButtonText || 'Cancel'}</Button
		>
	{/if}
</div>
