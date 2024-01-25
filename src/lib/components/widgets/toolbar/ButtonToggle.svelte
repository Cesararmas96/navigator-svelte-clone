<script lang="ts">
	import ButtonItem from './ButtonItem.svelte'
	import { createEventDispatcher } from 'svelte'

	type ToolbarItem = {
		name: string
		icon: string
		tooltipText: string
		action: (props: any) => void
	}
	type ToolbarToggle = {
		status: boolean
		items: Record<string, ToolbarItem>
	}

	export let isMobileDevice: boolean = false
	export let showInMenu: boolean
	export let item: ToolbarToggle

	const dispatch = createEventDispatcher()

	let status = item.status

	$: activeItem = item.items[status ? 'active' : 'inactive']
	const handleItemClick = (_status: boolean | undefined) => {
		if (_status !== undefined) status = _status
		dispatch('itemClick', status)
	}
</script>

<ButtonItem
	{showInMenu}
	item={activeItem}
	on:itemClick={(e) => handleItemClick(e.detail)}
	props={status}
/>
