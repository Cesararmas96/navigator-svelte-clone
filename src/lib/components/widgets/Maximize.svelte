<script lang="ts">
	import { selectedWidgetMaximize } from '$lib/stores/widgets'
	import Widget from './Widget.svelte'
	import WidgetBox from './WidgetBox.svelte'

	let widget: any
	$: if ($selectedWidgetMaximize) {
		widget = $selectedWidgetMaximize.widget
		widget.loaded = false
	}
</script>

{#if $selectedWidgetMaximize}
	<div class="widget-maximize">
		<WidgetBox {widget} let:fixed let:isOwner let:isToolbarVisible let:widget>
			<Widget {widget} {fixed} {isToolbarVisible} {isOwner} />
		</WidgetBox>
	</div>
{/if}

<style>
	.widget-maximize {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw !important;
		height: 100vh !important;
		border-radius: 0;
	}
</style>
