<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { Input, Label, Radio } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import ComponentType from '../ComponentType.svelte'

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')

	let mediaType: any
	let mediaTypeKey: string = ''
	$: {
		mediaType = mediaTypes.find((m) => m.key === mediaTypeKey)
		$widgetSettings.widget_type_id = mediaType ? `${mediaType?.key}` : ''
		$widgetSettings.classbase = mediaType ? mediaType?.classbase : ''
		$widgetSettings.url = ''
	}

	const mediaTypes = [
		{
			key: 'youtube',
			name: 'YouTube',
			icon: 'logos:youtube-icon',
			domains: ['youtube.com', 'youtu.be'],
			label: 'YouTube URL',
			placeholder: 'Ex. https://www.youtube.com/watch?v=...',
			classbase: 'YouTubeWidget'
		},
		{
			key: 'vimeo',
			name: 'Vimeo',
			icon: 'logos:vimeo-icon',
			domains: ['vimeo.com'],
			label: 'Vimeo URL',
			placeholder: 'Ex. https://vimeo.com/...',
			classbase: 'VimeoWidget'
		},
		{
			key: 'twitter',
			name: 'Tweet',
			icon: 'fa6-brands:x-twitter',
			domains: ['twitter.com', 'x.com'],
			label: 'Tweet URL',
			placeholder: 'Ex. https://twitter.com/...',
			classbase: 'TwitterWidget'
		},
		{
			key: 'spotify',
			name: 'Spotify',
			icon: 'logos:spotify-icon',
			domains: ['spotify.com'],
			label: 'Podcast URL',
			placeholder: 'Ex. https://open.spotify.com/...',
			classbase: 'SpotifyWidget'
		},
		// {
		// 	key: 'soundcloud',
		// 	name: 'SoundCloud',
		// 	icon: 'logos:soundcloud',
		// 	domains: ['soundcloud.com'],
		// 	label: 'Podcast URL',
		// 	placeholder: 'Ex. https://soundcloud.com/...',
		// 	classbase: 'SoundCloudWidget'
		// },
		{
			key: 'image',
			name: 'Image',
			icon: 'flat-color-icons:picture',
			domains: [],
			label: 'Image URL',
			placeholder: '',
			classbase: 'ImageWidget'
		},
		{
			key: 'excel',
			name: 'Excel File',
			icon: 'vscode-icons:file-type-excel',
			domains: [],
			label: 'Excel File URL',
			placeholder: '',
			classbase: 'ExcelWidget'
		},
		{
			key: 'pdf',
			name: 'PDF File',
			icon: 'vscode-icons:file-type-pdf2',
			domains: [],
			label: 'PDF File URL',
			placeholder: '',
			classbase: 'PdfWidget'
		},
		{
			key: 'iframe',
			name: 'iFrame',
			icon: 'icon-park:browser',
			domains: [],
			label: 'iFrame URL',
			placeholder: 'Ex. https://www.trocglobal.com',
			classbase: 'IframeWidget'
		}
	]

	const checkClass =
		'w-full cursor-pointer flex flex-col gap-1 text-xs leading-none justify-center items-center rounded-lg border-2 border-gray-200 bg-white p-2 font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-primary-300 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300'
</script>

<div class="mb-3 grid grid-cols-4 gap-2">
	{#each mediaTypes as type}
		<Radio bind:group={mediaTypeKey} custom value={type.key}>
			<div class={checkClass}>
				<Icon icon={type.icon} size="24" />{type.name}
			</div>
		</Radio>
	{/each}
</div>

{#if mediaType}
	<Label for="media-url" class="mb-2 block">{mediaType?.label}</Label>
	<Input
		id="media-url"
		name="media-url"
		class="form-control border-1 mb-3 rounded p-2 focus:ring-0"
		placeholder={mediaType?.placeholder}
		bind:value={$widgetSettings.url}
	/>
{/if}

{#if $widgetSettings.widget_type_id && $widgetSettings.classbase && $widgetSettings.url}
	<Label class="mb-2 block">Preview</Label>
	<ComponentType name={$widgetSettings?.classbase} data={$widgetSettings?.url} />
{/if}
