<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fetchFolders } from '$lib/helpers/widget/filemanager'
	import TreeViewItem from './TreeViewItem.svelte'
	import Icon from '$lib/components/common/Icon.svelte'

	export let folder: string
	export let pathFolders: string[]
	export let indexFolder: number

	const dispatch = createEventDispatcher()

	let path: string = ''
	let currentFolder: string = ''
	let folders: string[] = []
	let open: boolean = false

	$: {
		path = pathFolders.slice(0, indexFolder + 1).join('/')
		currentFolder = pathFolders[indexFolder]
		if (currentFolder === folder) {
			open = true
			fetchFolders(`${path}/`).then((data: any[]) => (folders = data))
		}
	}

	const isNextFolder = (folder: string) => {
		return pathFolders[indexFolder + 1] === folder.split('/')[folder.split('/').length - 1]
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	class="ml-2 flex cursor-pointer flex-col"
	on:click={(e) => {
		e.stopPropagation()
		const _path = indexFolder === 0 ? '' : `/${path}`
		const _folder = currentFolder === folder ? '' : `/${folder}`
		const newPath = `${_path}${_folder}/`.replace(/\/\//g, '/')
		dispatch('select', newPath)
		open = !open
	}}
>
	<div
		class="folder flex flex-row rounded p-2"
		class:active={open && currentFolder === folder && pathFolders.length - 1 === indexFolder}
	>
		<Icon
			icon={open ? 'flat-color-icons:opened-folder' : 'flat-color-icons:folder'}
			size="20"
			classes="mr-2"
		/>
		<span class="">{folder}</span>
	</div>
	{#if open && folders && folders.length}
		<ul>
			{#each folders as _folder}
				<TreeViewItem
					pathFolders={isNextFolder(_folder) ? pathFolders : pathFolders.slice(0, indexFolder + 1)}
					indexFolder={indexFolder + 1}
					folder={_folder.split('/')[_folder.split('/').length - 1]}
					on:select={(e) => dispatch('select', e.detail)}
				/>
			{/each}
		</ul>
	{/if}
</li>

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
