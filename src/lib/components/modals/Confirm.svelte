<script lang="ts">
	import { Button } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { modal } from '$lib/helpers/common/modal'

	const modalTypeIcon = {
		warning: 'tabler:alert-circle',
		info: 'tabler:info-circle'
	}

	type ModalType = 'warning' | 'info'

	export let props: {
		title?: string
		description: string
		type: ModalType
		confirmCallback: () => void
		confirmButtonText?: string
		cancelButtonText?: string
	}
</script>

<div class="text-center">
	<Icon icon={modalTypeIcon[props.type]} size="60px" />
	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{props.description}</h3>
	<Button color="red" class="mr-2" on:click={props.confirmCallback}
		>{props.confirmButtonText || 'Ok'}</Button
	>
	<Button color="alternative" on:click={() => ($modal = false)}
		>{props.cancelButtonText || 'Cancel'}</Button
	>
</div>
