<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import Icon from './Icon.svelte'
	import { ToastType } from '$lib/interfaces/Toast'

	const dispatch = createEventDispatcher()

	export let type: ToastType = ToastType.INFO
	export let dismissible = true

	const types = {
		error: { icon: 'mdi:alert-circle-outline', color: '#ff8259', bg: '#ffe6df' },
		success: { icon: 'mdi:check-circle-outline', color: '#6aca7e', bg: '#e2f4e5' },
		warning: { icon: 'mdi:alert-outline', color: '#ffb52b', bg: '#fff1d8' },
		info: { icon: 'mdi:information-outline', color: '#48acf3', bg: '#ddeefc' }
	}
</script>

<article
	style:--toast-color={types[type].color}
	style:--toast-color-bg={types[type].bg}
	class="mb-3 mr-5 flex w-80 flex-row items-center rounded-md px-4 py-4 leading-none drop-shadow-lg"
	role="alert"
	transition:fade
>
	<div class="toast-icon flex rounded-md p-0.5">
		<Icon icon={types[type].icon} size="20" />
	</div>

	<div class="ml-2 flex-1">
		<slot />
	</div>

	{#if dismissible}
		<button class="close mr-auto flex p-0" on:click={() => dispatch('dismiss')}>
			<Icon icon="mdi:close-circle-outline" size="20" />
		</button>
	{/if}
</article>

<style lang="postcss">
	article {
		background-color: var(--toast-color-bg);
		border-left: 5px solid var(--toast-color);
	}
	button,
	.toast-icon {
		color: var(--toast-color);
	}
	/* .toast-icon {
		color: var(--toast-color-bg);
		background-color: var(--toast-color);
	} */
</style>
