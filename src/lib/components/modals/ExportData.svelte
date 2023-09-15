<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'

	let formats = [
		{ value: 'csv', name: 'CSV', icon: 'bi:filetype-csv' },
		{ value: 'xlsx', name: 'XLSX', icon: 'bi:filetype-xlsx' },
		{ value: 'pdf', name: 'PDF', icon: 'bi:filetype-pdf' }
	]

	function onClick() {
		// dispatch('itemClick', { click: true })
	}
</script>

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
