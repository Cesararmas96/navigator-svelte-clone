<script lang="ts">
	import Widget from '$lib/components/widgets/Widget.svelte'
	import widgetData from '../../../../../data/json-widget.json'
	import { page } from '$app/stores'

	const aux = widgetData.filter((widget) => widget.uid === $page.params.uuid)

	const widget = {
		data: aux[0]
	}
</script>

<Widget {widget} />
