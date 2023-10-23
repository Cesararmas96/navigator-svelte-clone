<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher, getContext } from 'svelte'
	import html2canvas from 'html2canvas'
	import type { Writable } from 'svelte/store'
	import { sendSuccessNotification } from '$lib/stores/toast'

	const dispatch = createEventDispatcher()

	const widget = getContext<Writable<any>>('widget')

	const onClick = (e: any) => {
		e.preventDefault()
		dispatch('itemClick')
		$widget.loading = true

		sendSuccessNotification('Generating the screenshot, please wait...')
		setTimeout(async () => {
			const mainContent = document.getElementById(`widget-${$widget.widget_id}`)!

			mainContent.querySelector(`#widget-toolbar-${$widget.widget_id}`)!.classList.add('hidden')
			const spinner = mainContent.querySelector(`#spinner`)
			if (spinner) spinner.classList.add('hidden')

			mainContent.querySelectorAll('.animate__animated').forEach((element) => {
				element.classList.remove('animate__animated')
			})
			mainContent.querySelectorAll('.widget-toolbar').forEach((element) => {
				element.classList.add('hidden')
			})

			const canvas = await html2canvas(mainContent)
			sendSuccessNotification('Preparing to download...')
			const link = document.createElement('a')
			link.href = canvas.toDataURL('image/png')
			link.download = `${$widget.title}.png`
			link.click()
			$widget.loading = false
		}, 700)
	}
</script>

<DropdownItem class="flex items-center gap-2" on:click={onClick}>
	<Icon icon="tabler:camera" size="18" /> Screenshot
</DropdownItem>
