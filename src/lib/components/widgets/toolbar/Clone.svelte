<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
	<Icon icon="tabler:copy" size="18" />
</button>
<Tooltip placement="left">Clone</Tooltip>
