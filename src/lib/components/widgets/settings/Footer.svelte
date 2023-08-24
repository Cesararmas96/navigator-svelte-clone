<script lang="ts">
	import { Toggle } from 'flowbite-svelte'
	import { getContext } from 'svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')
</script>

<Toggle class=" my-2" bind:checked={$widgetSettings.params.settings.footer.show}>Show footer</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.footer.share}
	>Show share icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.footer.like}
	>Show like icon</Toggle
>
<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.footer.comments}
	>Show comments icon</Toggle
>
