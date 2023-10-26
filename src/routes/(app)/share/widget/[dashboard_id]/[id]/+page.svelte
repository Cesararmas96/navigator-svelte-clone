<script lang="ts">
	import Widget from '$lib/components/widgets/Widget.svelte'
	import WidgetBox from '$lib/components/widgets/WidgetBox.svelte'
	import { storeUser } from '$lib/stores/session'

	export let data

	const sharedWidget = { ...data.widget }
	sharedWidget.loaded = false
	storeUser.set(data.user)

	sharedWidget.shared = true
</script>

<WidgetBox widget={sharedWidget} let:fixed let:isOwner let:isToolbarVisible let:widget>
	<Widget {widget} {fixed} {isToolbarVisible} {isOwner} />
</WidgetBox>
