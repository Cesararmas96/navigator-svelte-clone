<script>
	import Icon from '$lib/components/common/Icon.svelte'
	import {
		createFolder,
		uploadFile,
		moveItem,
		copyItem
	} from '../../../../helpers/widget/filemanager'

	function handleCreateFolder() {
		createFolder()
	}

	function handleUploadFile() {
		uploadFile()
	}

	function handleMoveItem() {
		moveItem()
	}

	function handleCopyItem() {
		copyItem()
	}
</script>

<div class="flex w-full flex-row">
	<button
		on:click={handleCreateFolder}
		class="mr-2 flex rounded-md border bg-gray-100 px-3 py-1 hover:bg-gray-200"
		><Icon icon="tabler:folder-plus" size="20" classes="mr-1" /> New Folder</button
	>
	<button
		on:click={handleUploadFile}
		class="mr-2 flex rounded-md border bg-gray-100 px-3 py-1 hover:bg-gray-200"
		><Icon icon="tabler:file-upload" size="20" classes="mr-1" /> Upload File</button
	>
	<!-- <button on:click={handleMoveItem}>Mover</button>
	<button on:click={handleCopyItem}>Copiar</button> -->
</div>
