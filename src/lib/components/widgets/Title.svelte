<script lang="ts">
	import { getContext } from 'svelte'
	import Icon from '../common/Icon.svelte'

	let widget: any = getContext('widget')
</script>

<div class="min-w-0 flex-1 items-center">
	<h3 class="items-top flex flex-row py-1 text-base font-medium">
		{#if $widget?.data?.params?.settings?.header?.icon}
			<Icon
				icon={$widget?.data?.attributes?.icon || 'material-symbols:widgets-rounded'}
				classes="mr-1"
				size="18px"
			/>
		{/if}
		{#if $widget?.data?.params?.settings?.header?.title}
			<span>{$widget?.data?.title}</span>
		{/if}
	</h3>
</div>
