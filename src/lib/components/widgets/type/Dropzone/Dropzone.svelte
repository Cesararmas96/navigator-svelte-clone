<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Toggle } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
	let fileInput
	let dragging = false
	let _files: FileList

	export let isModal = false
	export let props: {
		subtitle: string
	}

	function handleDragOver(event) {
		event.preventDefault()
		dragging = true
	}

	function handleDrop(event) {
		event.preventDefault()
		const files = event.dataTransfer.files
		handleFiles(files)
	}

	function handleClick() {
		fileInput.click()
	}

	function handleFileSelect(event) {
		const files = event.target.files
		handleFiles(files)
	}

	function handleFiles(files) {
		_files = files
		dispatch('filesSelected', { files })
	}
</script>

<h1 class="text-2xl">{props.subtitle}</h1>
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="dropzone"
	on:click={handleClick}
	on:dragover={handleDragOver}
	on:dragleave={() => (dragging = false)}
	on:drop={handleDrop}
	class:dragging
	tabindex="0"
>
	<div class="dropzone-msg">
		{#if !_files}
			<Icon icon="fa-solid:cloud-upload-alt" size="54" classes="color-primary" />
			<p class="color-primary">Drop file here to upload, or <strong>browse</strong>.</p>
		{:else}
			{#each Array.from(_files) as file}
				<p>{file.name}</p>
			{/each}
		{/if}
		<input class="file-input" type="file" bind:this={fileInput} on:change={handleFileSelect} />
	</div>
</div>

<div class="flex flex-col gap-1">
	<Toggle class="switch-checkbox mb-2">Don't execute task after upload</Toggle>
	<Toggle class="switch-checkbox mb-2">Return immediately (No wait for task completion)</Toggle>
</div>

<style>
	.dropzone {
		border: 2px dashed #d3d3d3;
		border-color: #d3d3d3;
		border-style: dashed;
		border-width: 2px;
		border-radius: 5px;
		padding: 20px;
		text-align: center;
		cursor: pointer;
		outline: none;
	}
	.dropzone:hover {
		background-color: #f5f5f5;
	}
	.dragging {
		background-color: #f5f5f5;
	}

	.dropzone-msg {
		text-align: center;
		margin: 2em 0;
	}

	.file-input {
		display: none;
	}
</style>
