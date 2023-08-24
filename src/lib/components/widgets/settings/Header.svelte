<script lang="ts">
	import { Toggle } from 'flowbite-svelte'
	import { getContext } from 'svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')
</script>

<Toggle class="switch-checkbox my-2" bind:checked={$widgetSettings.params.settings.header.show}
	>Show header</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.header.title}
	>Show title</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.header.icon}
	>Show icon</Toggle
>
