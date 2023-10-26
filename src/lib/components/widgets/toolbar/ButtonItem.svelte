<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { DropdownItem, Tooltip } from 'flowbite-svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	type ToolbarItem = {
		name: string
		icon: string
		tooltipText: string
		action: (props: any) => void
	}

	const handleAction = async (e: Event) => {
		e.preventDefault()
		try {
			const response = await item.action(props)
			dispatch('itemClick', response)
		} catch (error) {
			sendErrorNotification(error)
			dispatch('itemClick', undefined)
		}
	}

	export let showInMenu: boolean
	export let item: ToolbarItem
	export let props: any = null
</script>

{#if !showInMenu}
	<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={handleAction}>
		<Icon icon={item.icon} size="18" />
	</button>
	<Tooltip placement="bottom" class="z-10">{item.tooltipText}</Tooltip>
{:else}
	<DropdownItem class="flex items-center gap-2" on:click={handleAction}>
		<Icon icon={item.icon} size="18" />
		{item.name}
	</DropdownItem>
	<Tooltip placement="left" class="z-10">{item.tooltipText}</Tooltip>
{/if}
