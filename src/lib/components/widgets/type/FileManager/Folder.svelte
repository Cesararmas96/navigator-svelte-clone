<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let path: string
	export let selected: any

	$: isSelected = selected && selected.type === 'folder' && selected.path === path

	const handleClick = () => {
		dispatch('select', {
			type: 'folder',
			path
		})
	}

	const handleDblClick = () => {
		dispatch('dblclick', path)
	}
</script>

<button
	class:active={isSelected}
	class="folder flex flex-col items-center p-1"
	on:click={handleClick}
	on:dblclick={handleDblClick}
>
	<Icon icon="flat-color-icons:folder" size="40" />
	<small class="tex text-center">{path.split('/')[path.split('/').length - 1]}</small>
</button>

<style>
	.folder.active {
		background-color: rgb(var(--theme-color) / 0.1);
		--tw-text-opacity: 1;
		color: rgb(var(--theme-color) / var(--tw-text-opacity));
		font-weight: 500;
	}
	.folder:not(.active):hover {
		background-color: rgb(var(--theme-light-200) / 0.6);
	}
</style>
