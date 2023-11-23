<script lang="ts">
	import { alerts } from '$lib/helpers/common/alerts'
	import Alert from './Alert.svelte'

	type Position = 'top' | 'content'

	export let dashboardId: string | undefined = undefined
	export let position: Position = 'content'
	$: _alerts = $alerts.filter((alert) => {
		return (
			(!alert.dashboardId || alert.dashboardId === dashboardId) &&
			((position === 'top' && alert.id?.includes(position)) ||
				(position === 'content' && !alert.id?.includes('top')))
		)
	})
</script>

{#if _alerts && _alerts.length > 0}
	<div id="alerts" class="mt-2">
		{#each _alerts as alert}
			<Alert {alert} />
		{/each}
	</div>
{/if}
