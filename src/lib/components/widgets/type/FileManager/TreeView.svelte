<script lang="ts">
	import { onMount } from 'svelte'
	import { fetchFolders } from '$lib/helpers/widget/filemanager'
	import TreeViewItem from './TreeViewItem.svelte'

	export let path: string

	let pathFolders: string[] = []
	let indexFolder: number = 0
	$: pathFolders = path !== '/' ? path.split('/').filter((p) => p !== '') : []
	let folders: string[] = []

	onMount(() => {
		fetchFolders('').then((data: any[]) => (folders = data))
	})

	const isNextFolder = (folder: string) => {
		return pathFolders[indexFolder] === folder.split('/')[0]
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
