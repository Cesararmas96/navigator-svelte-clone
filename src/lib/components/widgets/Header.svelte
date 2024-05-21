<script lang="ts">
	import WidgetToolbar from './Toolbar.svelte'
	import HeaderTitle from './Title.svelte'
	import { getContext, onMount } from 'svelte'

	export let isToolbarVisible: boolean
	export let isMobileDevice: boolean = false

	const widget: any = getContext('widget')
</script>

<div class="widget-header space-y flex space-x-3">
	<div id={`widget-title-${$widget.widget_id}`} class="widget-header ml-1 flex space-x-3">
		<HeaderTitle
			icon={$widget?.params?.settings?.header?.icon ? $widget?.attributes?.icon : undefined}
			title={$widget?.params?.settings?.header?.title
				? $widget?.title || $widget?.attributes?.title
				: undefined}
		/>
		<WidgetToolbar {isToolbarVisible} {isMobileDevice} />
	</div>
</div>
