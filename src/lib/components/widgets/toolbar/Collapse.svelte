<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'

	const widget: any = getContext('widget')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	// $widget.collapse_action = null
	$widget.collapse = false
</script>

<button
	class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	on:click={(event) => {
		const collapseAction = getWidgetAction($widgetActions, 'collapse')
		collapseAction.action()
		$widget.collapse = !$widget.collapse
	}}
>
	<Icon icon={$widget.collapse ? 'mdi:chevron-down' : 'mdi:chevron-up'} size="18" />
</button>
<Tooltip placement="left">{$widget.collapse ? 'Expand' : 'Collapse'}</Tooltip>
