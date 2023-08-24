<script lang="ts">
	import { Input, Label, Textarea, Toggle } from 'flowbite-svelte'
	import IconsDropDown from '../IconsDropDown.svelte'
	import { getContext } from 'svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')
</script>

<div class="mb-4">
	<Label for="title" class="mb-2 block">Title</Label>
	<Input
		id="title"
		name="title"
		required
		class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
		placeholder="Dashboard title"
		bind:value={$widgetSettings.title}
	/>
</div>
<div class="">
	<Label for="description" class="mb-2">Description</Label>
	<Textarea
		id="description"
		class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
		placeholder="Write widget description..."
		rows="3"
		name="description"
		bind:value={$widgetSettings.description}
	/>
</div>
<div class="mb-4 flex flex-row items-center justify-between">
	<Label class="mr-4">Icon</Label>
	<IconsDropDown
		icon={$widgetSettings.attributes.icon}
		on:click={(event) => ($widgetSettings.attributes.icon = event.detail)}
	/>
</div>

<div class="card mb-4 flex flex-col bg-gray-50 p-3">
	<Label class="mb-2">Preferences</Label>
	<Toggle
		class="switch-checkbox mb-2"
		bind:checked={$widgetSettings.params.settings.general.draggable}>Allow drag & drop</Toggle
	>
	<Toggle
		class="switch-checkbox mb-2"
		bind:checked={$widgetSettings.params.settings.general.resizable}>Allow resize</Toggle
	>
	<Toggle
		class="switch-checkbox mb-2"
		bind:checked={$widgetSettings.params.settings.general.scrollable}>Allow inside scroll</Toggle
	>
	<Toggle class="switch-checkbox mb-2" bind:checked={$widgetSettings.params.settings.general.fixed}
		>Fixed widget</Toggle
	>
</div>
