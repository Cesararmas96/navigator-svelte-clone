<script lang="ts">
	import { capitalizeWord } from '$lib/helpers/common/common'
	import ComponentBase from './ComponentBase.svelte'
	import ComponentType from './ComponentType.svelte'

	export let widget: any

	let widgetBase: string
	let classbase: string

	if (widget && widget.widget_type_id) {
		widgetBase = capitalizeWord(widget.widget_type_id.split('-')[0])
		classbase = widget.classbase
	}
</script>

<div id={`widget-content-${widget.uid}`}>
	<ComponentBase name={widgetBase} let:data>
		<ComponentType name={classbase} {data} />
	</ComponentBase>
</div>
