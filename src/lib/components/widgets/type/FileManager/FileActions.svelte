<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Input } from 'flowbite-svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import { storeUser } from '$lib/stores'
	import { page } from '$app/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	export let path: string

	const tenant = $page.data.tenant
	const dispatch = createEventDispatcher()

	function _uploadFile(file) {
		const formData = new FormData()
		formData.append('file_name', file)

		const urlBase = import.meta.env.VITE_API_URL
		const headers = new Headers({ authorization: `Bearer ${$storeUser?.token}` })

		fetch(`${urlBase}/services/files/portal/symbits/${tenant}${path}`, {
			method: 'POST',
			headers,
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				sendSuccessNotification('File uploaded successfully')
				dispatch('fileDownloaded', true)
			})
			.catch((error) => {
				sendErrorNotification('There was an error uploading the file')
			})
	}

	const handleUploadFile = () => {
		const fileInput = document.getElementById('fileInput')
		fileInput?.click()
	}

	const handleFileInput = (event: any) => {
		const file = event?.target?.files[0]
		if (file) {
			_uploadFile(file)
		}
	}
</script>

<div class="flex w-full flex-row">
	<Input type="file" id="fileInput" style="display: none;" on:change={handleFileInput} />
	<button
		id="uploadButton"
		on:click|stopPropagation={handleUploadFile}
		color="primary"
		class="btn mr-2 flex w-32 rounded-md border bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200"
		><Icon icon="tabler:file-upload" size="20" classes="mr-1" />Upload File</button
	>
	<Input
		type="text"
		disabled
		id="path"
		defaultClass="w-full !py-1 !px-3 !rounded-md"
		value={`Path: ${path}`}
	/>
</div>
