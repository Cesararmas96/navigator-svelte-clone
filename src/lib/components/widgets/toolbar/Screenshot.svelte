<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	function onClick() {
		dispatch('itemClick', { click: true })
	}
</script>

<DropdownItem class="flex items-center gap-2" on:click={onClick}>
	<Icon icon="tabler:camera" size="18" /> Screenshot
</DropdownItem>
