<script lang="ts">
	import WidgetToolbar from './Toolbar.svelte'
	import HeaderTitle from './Title.svelte'
	import { getContext } from 'svelte'

	export let isToolbarVisible: boolean

	const widget: any = getContext('widget')
	const showToolbar: boolean = $widget?.params?.settings?.toolbar?.show
</script>

<div class="widget-header space-y flex space-x-3">
	<div class="widget-header flex space-x-3">
		<HeaderTitle />
		{#if showToolbar}<WidgetToolbar {isToolbarVisible} />{/if}
	</div>
</div>
