<script lang="ts">
	import ButtonItem from './ButtonItem.svelte'

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

	export let showInMenu: boolean
	export let item: ToolbarToggle

	let status = item.status

	$: activeItem = item.items[status ? 'active' : 'inactive']
	const handleItemClick = (_status: boolean | undefined) => {
		if (_status !== undefined) status = _status
	}
</script>

<ButtonItem
	{showInMenu}
	item={activeItem}
	on:itemClick={(e) => handleItemClick(e.detail)}
	props={status}
/>
