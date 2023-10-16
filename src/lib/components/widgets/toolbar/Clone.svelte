<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	const cloneWidget = () => {
		const cloneAction = getWidgetAction($widgetActions, 'clone')
		cloneAction.action()
	}
</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={() => cloneWidget()}>
	<Icon icon="tabler:copy" size="18" />
</button>
<Tooltip placement="left">Clone</Tooltip>
