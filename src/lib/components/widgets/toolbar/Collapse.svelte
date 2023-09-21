<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
	$widget.collapse_action = null
	$widget.collapse = false
</script>

<button
	class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	on:click={(event) => {
		$widget.collapse_action = 'collapse'
		$widget.collapse = !$widget.collapse
	}}
>
	<Icon icon={$widget.collapse ? 'mdi:chevron-down' : 'mdi:chevron-up'} size="18" />
</button>
<Tooltip placement="left">{$widget.collapse ? 'Expand' : 'Collapse'}</Tooltip>
