<script lang="ts">
	import { capitalizeWord } from '$lib/helpers/common/common'
	import { storeCCPWidget, storeCCPWidgetBehavior } from '$lib/stores/dashboards'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import ItemContent from './ItemContent.svelte'

	export let action: any
	export let showInMenu: boolean

	const widget = getContext<Writable<any>>('widget')

	const icon = {
		copy: 'tabler:clipboard-copy',
		cut: 'ion:cut-sharp'
	}

	const handleWidgetCopyorCut = (widget: any, action: string) => {
		storeCCPWidget.set($widget)
		storeCCPWidgetBehavior.set(action)
	}
</script>

<ItemContent
	{showInMenu}
	name={capitalizeWord(action)}
	icon={icon[action]}
	callback={() => handleWidgetCopyorCut(widget, action)}
/>

<!-- <button
	class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	on:click={() => handleWidgetCopyorCut(widget, action)}
>
	<Icon icon={icon[action]} size="18" />
</button>
<DropdownItem
	class="flex items-center gap-2"
	on:click={() => handleWidgetCopyorCut(widget, action)}
>
	<Icon icon={icon[action]} size="18" />
	{capitalizeWord(action)}
</DropdownItem> -->
<!-- <Tooltip placement="bottom" class="z-10">{capitalizeWord(action)}</Tooltip> -->
