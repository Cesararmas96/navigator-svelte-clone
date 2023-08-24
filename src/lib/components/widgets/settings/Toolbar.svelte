<script lang="ts">
	import { Toggle } from 'flowbite-svelte'
	import { getContext } from 'svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')
</script>

<Toggle class=" my-2" bind:checked={$widgetSettings.params.settings.toolbar.show}
	>Show toolbar</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.close}
	>Show close icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.reload}
	>Show reload icon</Toggle
>
<Toggle
	class="switch-checkbox mb-2"
	bind:checked={$widgetSettings.params.settings.toolbar.filtering}>Show filter icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.clone}
	>Show duplicate icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.help}
	>Show help icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.max}
	>Show maximize icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.toolbar.export}
	>Show export data icon</Toggle
>
<Toggle
	class="switch-checkbox mb-2"
	bind:checked={$widgetSettings.params.settings.toolbar.screenshot}>Show screenshot icon</Toggle
>
