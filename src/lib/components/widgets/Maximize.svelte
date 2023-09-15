<script>
	import { selectedWidgetMaximize } from '$lib/stores/widgets'
	import Widget from './Widget.svelte'
	import WidgetBox from './WidgetBox.svelte'

	$: widget = $selectedWidgetMaximize
</script>

{#if widget}
	<div class="widget-maximize">
		<WidgetBox widget={$widget} let:widget let:fixed let:isOwner let:isToolbarVisible>
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
