<script lang="ts">
	import Dropdown from '$lib/components/common/Dropdown.svelte'
	import { Input, Label, Textarea } from 'flowbite-svelte'
	import { getContext } from 'svelte'

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

	var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	const getYoutubeID = (url: string) => {
		if (!url) return null
		var match = url.match(regExp)
		return match && match[2].length == 11 ? match[2] : null
	}
</script>

<div class="mb-4">
	<Dropdown {items} selectedValue={type} label={'Type'} on:change={handleType} />

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
		<Label for="slug" class="mb-2 block">Media URL</Label>
		<Input
			id="url"
			name="url"
			class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
			placeholder="Media URL (iFrame, Youtube, Vimeo, etc.)"
			bind:value={$widgetSettings.url}
		/>
		{@html getYoutubeID($widgetSettings.url)}
	{/if}
</div>
