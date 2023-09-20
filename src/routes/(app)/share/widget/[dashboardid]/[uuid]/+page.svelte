<script lang="ts">
	import Widget from '$lib/components/widgets/Widget.svelte'
	import WidgetBox from '$lib/components/widgets/WidgetBox.svelte'

	export let data
</script>

<WidgetBox widget={data.widget} let:fixed let:isOwner let:isToolbarVisible>
	<Widget {fixed} {isToolbarVisible} {isOwner} />
</WidgetBox>
