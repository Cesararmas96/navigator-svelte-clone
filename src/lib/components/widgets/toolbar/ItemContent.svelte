<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { DropdownItem, Tooltip } from 'flowbite-svelte'

	export let showInMenu: boolean
	export let name: string
	export let icon: string
	export let callback: () => void
</script>

{#if !showInMenu}
	<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={callback}>
		<Icon {icon} size="18" />
	</button>
{:else}
	<DropdownItem class="flex items-center gap-2" on:click={callback}>
		<Icon {icon} size="18" />
		{name}
	</DropdownItem>
{/if}
<Tooltip placement="bottom" class="z-10">{name}</Tooltip>
