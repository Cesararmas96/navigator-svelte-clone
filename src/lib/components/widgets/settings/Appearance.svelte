<script lang="ts">
	import HelpTooltip from '$lib/components/common/HelpTooltip.svelte'
	import { Input, Label, Radio, Range, Toggle } from 'flowbite-svelte'
	import { getContext } from 'svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	let bgType: string = 'color'

	if ($widgetSettings.params.settings.appearance.background) {
		bgType = !patternUrl.test($widgetSettings.params.settings.appearance.background)
			? 'color'
			: 'image'
	}
</script>

<Label class="mb-2">Background</Label>
<div class="card p-2">
	<div class="mb-4">
		<div class="grid grid-cols-2 gap-2">
			<div class="rounded border border-gray-200 dark:border-gray-700">
				<Radio
					bind:group={bgType}
					class="w-full p-2"
					value="color"
					on:click={() => ($widgetSettings.params.settings.appearance.background = '')}>Color</Radio
				>
			</div>
			<div class="rounded border border-gray-200 dark:border-gray-700">
				<Radio
					bind:group={bgType}
					class="w-full p-2"
					value="image"
					on:click={() => ($widgetSettings.params.settings.appearance.background = '')}>Image</Radio
				>
			</div>
		</div>
	</div>
	{#if bgType === 'image'}
		<div class="mb-4">
			<Label for="image" class="mb-2 block">Image</Label>
			<Input
				id="image"
				name="image"
				class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
				placeholder="Image URL"
				bind:value={$widgetSettings.params.settings.appearance.background}
			/>
		</div>
	{:else}
		<div class="mb-4 flex flex-row items-center justify-between">
			<div class="flex flex-row">
				<Label>Color</Label>
				<HelpTooltip>color picker</HelpTooltip>
			</div>
			<Input
				type="color"
				class="form-control border-1 mb-3 w-20 rounded p-[2px]"
				bind:value={$widgetSettings.params.settings.appearance.background}
			/>
		</div>
	{/if}
	<div class="mb-4 flex flex-row items-center justify-between">
		<div class="mr-2 flex flex-row">
			<Label>Opacity</Label>
			<HelpTooltip placement="bottom">Opacity selector</HelpTooltip>
		</div>

		<Range
			id="range-steps"
			min="0"
			max="100"
			bind:value={$widgetSettings.params.settings.appearance.opacity}
			step="10"
		/>

		<div class="ml-2">{Math.round($widgetSettings.params.settings.appearance.opacity)}%</div>
	</div>
</div>
<div class="my-4 flex flex-row items-center justify-between">
	<div class="flex flex-row">
		<Label>Font color</Label>
	</div>
	<Input
		type="color"
		class="form-control border-1 w-20 rounded p-[2px]"
		bind:value={$widgetSettings.params.settings.appearance.color}
	/>
</div>
<div class="my-4">
	<Toggle
		class="switch-checkbox mb-2"
		bind:checked={$widgetSettings.params.settings.appearance.border}>Show border</Toggle
	>
</div>
