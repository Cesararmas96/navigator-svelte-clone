<script lang="ts">
	import Dropdown from '$lib/components/common/Dropdown.svelte'
	import { Input, Label, Radio, Textarea } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import TypeMedia from './TypeMedia.svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')

	let type: string = $widgetSettings.widget_type_id.split('-')[0] || ''

	const items = [
		{
			label: 'API Querysource',
			value: 'api'
		},
		{
			label: 'API Rest',
			value: 'rest'
		},
		{
			label: 'Media',
			value: 'media'
		}
	]

	const methods = [
		{
			label: 'GET',
			value: 'GET'
		},
		{
			label: 'POST',
			value: 'POST'
		}
	]

	const handleType = (e: any) => {
		type = e.detail.value
		if (type === 'api' && (!$widgetSettings.query_slug || !$widgetSettings.query_slug.slug)) {
			$widgetSettings.query_slug = {
				slug: ''
			}
		} else if (
			type === 'rest' &&
			(!$widgetSettings.query_slug || !$widgetSettings.query_slug.url)
		) {
			$widgetSettings.query_slug = {
				url: '',
				method: '',
				body: ''
			}
		}
	}

	const checkClass =
		'w-full h-10 cursor-pointer flex flex-col gap-1 text-sm leading-none justify-center text-center items-center rounded-lg border-2 border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-primary-300 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300'
</script>

<div class="mb-4">
	<Label class="mb-2 block">Type</Label>
	<div class="mb-3 mt-2 grid w-full grid-cols-3 gap-2">
		{#each items as item}
			<Radio bind:group={type} custom value={item.value}>
				<div class={checkClass}>
					{item.label}
				</div>
			</Radio>
		{/each}
	</div>

	{#if type === 'api'}
		<Label for="slug" class="mb-2 block">Slug</Label>
		<Input
			id="slug"
			name="slug"
			class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
			placeholder="Queryslug"
			bind:value={$widgetSettings.query_slug.slug}
		/>
	{:else if type === 'rest'}
		<Dropdown
			items={methods}
			selectedValue={'GET'}
			label={'Method'}
			on:change={(e) => ($widgetSettings.query_slug.method = e.detail.value)}
		/>
		<Label for="slug" class="mb-2 block">Endopint URL</Label>
		<Input
			id="url"
			name="url"
			class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
			placeholder="Endopint URL"
			bind:value={$widgetSettings.query_slug.url}
		/>
		{#if $widgetSettings.query_slug.method === 'POST'}
			<Label for="description" class="mb-2">Method POST body</Label>
			<Textarea
				id="body"
				class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
				placeholder="Method POST body..."
				rows="3"
				name="body"
				bind:value={$widgetSettings.query_slug.body}
			/>
		{/if}
	{:else if type === 'media'}
		<Label class="mb-2 block">Source</Label>
		<TypeMedia />
	{/if}
</div>
