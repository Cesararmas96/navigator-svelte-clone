<script lang="ts">
	import Icon from '../common/Icon.svelte'

	export let title: string
	export let icon: string
</script>

<div class="min-w-0 flex-1 items-center">
	<h3 class="items-top flex flex-row py-1 text-base font-medium">
		{#if icon}
			<Icon icon={icon || 'material-symbols:widgets-rounded'} classes="mr-1" size="18px" />
		{/if}
		{#if title}
			{title}
		{/if}
	</h3>
</div>
