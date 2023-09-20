<script lang="ts">
	import type { Writable } from 'svelte/store'
	import ComponentBase from './ComponentBase.svelte'
	import ComponentType from './ComponentType.svelte'

	export let widget: Writable<any>
</script>

<div id={`widget-content-${$widget.uid}`}>
	<ComponentBase {widget} let:data>
		<ComponentType {widget} {data} />
	</ComponentBase>
</div>
