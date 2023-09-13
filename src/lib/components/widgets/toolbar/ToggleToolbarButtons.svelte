<script>
import Icon from "$lib/components/common/Icon.svelte";
import {Tooltip} from "flowbite-svelte";

export let icon
export let tooltipText
export let action
export let status = false

export let secondIcon = icon
export let secondTooltipText = tooltipText

</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={action}>
	<Icon icon={!status ? icon : secondIcon} size="18" on:click={action}/>
</button>
<Tooltip placement="left">{!status ? tooltipText : secondTooltipText}</Tooltip>

