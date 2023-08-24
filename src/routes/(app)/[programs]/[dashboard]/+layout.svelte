<script>
	import DashboardSettings from '$lib/components/dashboards/Settings.svelte'
	import WidgetMaximize from '$lib/components/widgets/Maximize.svelte'
	import WidgetSettings from '$lib/components/widgets/Settings.svelte'
</script>

<slot />
<DashboardSettings />
<WidgetSettings />

<WidgetMaximize />
