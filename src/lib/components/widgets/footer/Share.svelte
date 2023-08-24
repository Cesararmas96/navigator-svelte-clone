<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
</script>

<span class="inline-flex items-center text-sm">
	<a
		href={`/share/widget/${$widget?.data?.uid}`}
		target="_blank"
		class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	>
		<Icon icon="mdi:share-variant" size="18" />
	</a>
</span>
