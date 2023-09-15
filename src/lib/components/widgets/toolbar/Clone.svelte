<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { addInstance } from '$lib/helpers/widget/instances'

	const widget = getContext<Writable<any>>('widget')
	const instances = getContext<Writable<any>>('widgetInstances')
	const cloneWidget = () => {
		const _widget = { ...$widget }
		addInstance(instances, _widget)
	}
</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={() => cloneWidget()}>
	<Icon icon="tabler:copy" size="18" />
</button>
<Tooltip placement="left">Clone</Tooltip>
