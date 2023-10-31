<script lang="ts">
	import Sidebar from './Sidebar.svelte'
	import DetailsPanel from './DetailsPanel.svelte'
	import FileActions from './FileActions.svelte'
	import { modal, openModal } from '$lib/helpers/common/modal'
	import { Button } from 'flowbite-svelte'

	export let path: string = '/'
	export let isModal: boolean = false
	export let callback: (file: any) => void

	let selectedFile: any = null

	const handleFolderSelect = (event: CustomEvent) => {
		path = event.detail
	}

	const handleFileSelect = (event: CustomEvent) => {
		selectedFile = event.detail
	}

	const handleConfirmFile = (event: CustomEvent) => {
		selectedFile = event.detail
		if (isModal) {
			callback(selectedFile)
			$modal = null
		}
	}

	/**
	 * This is Temporary to get the selected file from the modal
	 */
	let _selectedFile: any = ''
	const _confirmCallback = (file: any) => {
		_selectedFile = file.path
	}

	const handleClick = () => {
		openModal('File Manager', 'FileManagerModal', {
			size: 'lg',
			path: '/',
			confirmCallback: _confirmCallback
		})
	}
</script>

<section class="flex h-full max-h-[400px] min-h-[400px] w-full flex-row gap-2 p-2">
	<div class="flex w-[25%] flex-col overflow-y-auto rounded-md border bg-white">
		<div class="ml-2 p-2 font-bold text-heading">Folders</div>
		<Sidebar bind:path on:select={handleFolderSelect} />
	</div>
	<div class="flex w-[75%] flex-col gap-2">
		<!-- <div class="w-full p-2">Path: {path}</div> -->
		<FileActions />
		<DetailsPanel
			{path}
			on:select={handleFolderSelect}
			on:fileSelect={handleFileSelect}
			on:fileConfirm={handleConfirmFile}
		/>
	</div>
</section>

{#if isModal}
	<Button color="primary" class="float-right m-2" disabled={!selectedFile} on:click={callback}
		>Select File</Button
	>
{:else}
	<div class="mt-5 flex flex-col items-center justify-center gap-3">
		<Button color="primary" on:click={handleClick}>Open File Manager in Modal</Button>
		{_selectedFile}
	</div>
{/if}
