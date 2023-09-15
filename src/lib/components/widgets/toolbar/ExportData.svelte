<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher, getContext } from 'svelte'
	import { openExportDataModal } from '$lib/helpers/common/modal'
	import type { Writable } from 'svelte/store'
	const dispatch = createEventDispatcher()

	const modal = getContext<Writable<any>>('modal')
	function onClick() {
		openExportDataModal(modal)
		dispatch('itemClick', { click: true })
	}
</script>

<DropdownItem class="flex items-center gap-2" on:click={onClick}>
	<Icon icon="tabler:file-export" size="18" /> Export Data
</DropdownItem>
