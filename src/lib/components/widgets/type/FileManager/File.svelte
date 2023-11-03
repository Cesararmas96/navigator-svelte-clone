<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	type File = {
		path: string
		filename: string
		size: string
		mimetype: string
	}

	enum FileTypes {
		'application/vnd.ms-excel' = 'vscode-icons:file-type-excel',
		'image/png' = 'vscode-icons:file-type-image',
		'image/jpeg' = 'vscode-icons:file-type-image',
		'text/plain' = 'vscode-icons:file-type-text',
		'video/quicktime' = 'vscode-icons:file-type-video',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation' = 'vscode-icons:file-type-powerpoint'
	}

	export let file: File
	export let selected: any

	$: icon = FileTypes[file.mimetype] || FileTypes['text/plain']

	$: isSelected = selected && selected.type === 'file' && selected.path === file.path

	const handleClick = () => {
		dispatch('select', {
			type: 'file',
			path: file.path
		})
	}

	const handleDblClick = () => {
		dispatch('dblclick', file)
	}
</script>

<button
	class:active={isSelected}
	class="file flex flex-col items-center rounded p-1"
	on:click={handleClick}
	on:dblclick={handleDblClick}
>
	<Icon {icon} size="40" />
	<small class="min-w-[80px] text-center">{file.filename}</small>
	<small class="text-center">{file.size}</small>
</button>

<style>
	.file.active {
		background-color: rgb(var(--theme-color) / 0.1);
		--tw-text-opacity: 1;
		color: rgb(var(--theme-color) / var(--tw-text-opacity));
		font-weight: 500;
	}

	.file:not(.active):hover {
		background-color: rgb(var(--theme-light-200) / 0.6);
	}
</style>
