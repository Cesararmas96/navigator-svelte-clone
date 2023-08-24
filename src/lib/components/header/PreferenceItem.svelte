<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function onClick() {
		dispatch('click', 'DropdownItem')
	}

	export let id: string
	export let name: string
	export let icon: string
</script>

<DropdownItem
	class="rounded-lg border border-light-200 bg-light-100/50 p-3 text-center transition-colors duration-300 hover:bg-light-100 dark:border-dark-300 dark:bg-dark-300/50 dark:hover:bg-dark-300"
	on:click={onClick}
	{id}
>
	<Icon {icon} size="18px" classes="-mt-0.5 mb-1 inline-block text-2xl font-light" />
	<div class="text-sm font-bold leading-tight text-heading">{name}</div>
</DropdownItem>
