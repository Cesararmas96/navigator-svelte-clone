<script lang="ts">
	import { Popover } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'

	export let helpText: string = ''
</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" id="help">
	<Icon icon={'tabler:help'} size="18" />
</button>
<Popover
	class="z-50 w-64 text-sm font-light"
	title="Help"
	triggeredBy="#help"
	placement="bottom-end">{helpText}</Popover
>
