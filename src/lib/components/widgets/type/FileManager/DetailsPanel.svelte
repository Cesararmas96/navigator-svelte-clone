<script lang="ts">
	import { fetchFolderDetails } from '$lib/helpers/widget/filemanager'
	import { createEventDispatcher } from 'svelte'
	import File from './File.svelte'
	import Folder from './Folder.svelte'
	import { loading } from '$lib/stores/preferences'
	import { page } from '$app/stores'

	export let path: string
	export let refreshFolder: boolean

	let folders: any[] = []
	let files: any[] = []
	let selected: any

	const dispatch = createEventDispatcher()

	$: if (path) {
		loadFolderDetails()
	}

	$: if (refreshFolder) {
		refreshFolder = false
		loadFolderDetails()
	}

	const loadFolderDetails = () => {
		loading.set(true)
		fetchFolderDetails($page.data.tenant, path).then((data: any) => {
			files = data.filter((file) => typeof file === 'object')
			folders = data.filter((folder) => typeof folder === 'string')
			loading.set(false)
		})
	}

	const handleFolderDblClick = (e: CustomEvent) => {
		selected = null
		dispatch('select', `${e.detail}`)
	}
	const handleFileSelection = (e: CustomEvent) => {
		selected = e.detail
		dispatch('fileSelect', e.detail)
	}
	const handleFileDblClick = (e: CustomEvent) => {
		dispatch('fileConfirm', e.detail)
	}
</script>

{#if path}
	<div class="files-container h-full w-full overflow-y-auto rounded-md border bg-white p-2">
		{#each folders as folder}
			<Folder
				path={folder}
				{selected}
				on:select={(e) => (selected = e.detail)}
				on:dblclick={handleFolderDblClick}
			/>
		{/each}
		{#each files as item}
			<File
				file={item}
				{selected}
				on:select={handleFileSelection}
				on:dblclick={handleFileDblClick}
			/>
		{/each}
	</div>
{/if}

<style>
	.files-container {
		display: grid;
		grid-auto-columns: minmax(100px, auto);
		grid-template-columns: repeat(auto-fill, minmax(100px, auto));
		grid-auto-rows: min-content;
		grid-gap: 5px;
	}
</style>
