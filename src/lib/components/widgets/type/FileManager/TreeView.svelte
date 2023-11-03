<script lang="ts">
	import { onMount } from 'svelte'
	import { fetchFolders } from '$lib/helpers/widget/filemanager'
	import TreeViewItem from './TreeViewItem.svelte'
	import { page } from '$app/stores'

	export let path: string

	let pathFolders: string[] = []
	let indexFolder: number = 0
	let folders: string[] = []

	$: pathFolders = path !== '/' ? path.split('/').filter((p) => p !== '') : []

	onMount(() => {
		fetchFolders($page.data.tenant, path).then((data: any[]) => (folders = data))
	})

	const isNextFolder = (folder: string) => {
		return pathFolders[indexFolder] === folder.split('/')[folder.split('/').length - 1]
	}
</script>

<ul class="w-full pr-2">
	{#each folders as _folder}
		<TreeViewItem
			pathFolders={isNextFolder(_folder) ? pathFolders : pathFolders.slice(0, indexFolder + 1)}
			{indexFolder}
			folder={_folder.split('/')[_folder.split('/').length - 1]}
			on:select
		/>
	{/each}
</ul>
