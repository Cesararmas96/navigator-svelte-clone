<script lang="ts">
	import { DropdownItem, Modal, Select, Input, Checkbox, Label } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher, getContext } from 'svelte'

	const dispatch = createEventDispatcher()

	let widgetActions: any = getContext('widgetActions')
	let openExportData = false
	let selected: any
	let formats = [
		{ value: 'csv', name: 'CSV', icon: 'bi:filetype-csv' },
		{ value: 'xlsx', name: 'XLSX', icon: 'bi:filetype-xlsx' },
		{ value: 'pdf', name: 'PDF', icon: 'bi:filetype-pdf' }
	]

	$: exportData = $widgetActions.find((action: any) => action.name === 'exportData')

	function onClick() {
		openExportData = true
		// dispatch('itemClick', { click: true })
	}
</script>

{#if exportData}
	<DropdownItem class="flex items-center gap-2" on:click={onClick}>
		<Icon icon="tabler:file-export" size="18" /> Export Data
	</DropdownItem>
{/if}

<Modal title="Export Data" bind:open={openExportData} size="xs">
	<p class="text-sm font-normal text-gray-500 dark:text-gray-400">Choose file export format.</p>
	<span class="my-4 space-y-3">
		<!-- <Select class="mt-2" items={formats} bind:value={selected} /> -->

		<ul class="my-4 space-y-3">
			{#each formats as format}
				<li>
					<a
						href="/"
						class="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
					>
						<span class="ml-3 flex-1 items-center whitespace-nowrap">
							<Icon icon={format.icon} size="18" />
							{format.name}</span
						>
					</a>
				</li>
			{/each}
		</ul>
	</span>
</Modal>
