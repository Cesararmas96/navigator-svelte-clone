<script lang="ts">
	import { DropdownItem, Button, Modal, Select, Input, Checkbox } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher, getContext } from 'svelte'

	const dispatch = createEventDispatcher()

	let widgetActions: any = getContext('widgetActions')
	let walletModal = false
	let selected: any
	let formats = [
		{ value: 'csv', name: 'CSV' },
		{ value: 'xlsx', name: 'XLSX' },
		{ value: 'pdf', name: 'PDF' }
	]

	$: exportData = $widgetActions.find((action: any) => action.name === 'exportData')

	function onClick() {
		walletModal = true
		// dispatch('itemClick', { click: true })
	}
</script>

{#if exportData}
	<DropdownItem class="flex items-center gap-2" on:click={onClick}>
		<Icon icon="tabler:file-export" size="18" /> Export Data
	</DropdownItem>
{/if}

<Modal title="Export Data" bind:open={walletModal} size="xs">
	<p class="text-sm font-normal text-gray-500 dark:text-gray-400">Choose file export format.</p>
	<span class="my-4 space-y-3">
		<Select class="mt-2" items={formats} bind:value={selected} />
		<!-- <select name="select">
			<option value="value1">Value 1</option>
			<option value="value2" selected>Value 2</option>
			<option value="value3">Value 3</option>
		</select> -->
	</span>
</Modal>
