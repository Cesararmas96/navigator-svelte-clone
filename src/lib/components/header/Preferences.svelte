<script lang="ts">
	import { Dropdown } from 'flowbite-svelte'

	import Icon from '../common/Icon.svelte'
	import PreferenceItem from './PreferenceItem.svelte'
	import { onMount } from 'svelte'
	import { themeMode } from '$lib/stores/preferences'
	import ThemeColorPicker from './ThemeColorPicker.svelte'

	let _themeMode: string | null

	onMount(() => {
		$themeMode = localStorage.getItem('theme-mode') || 'light'
	})

	function handleDarkMode() {
		if (localStorage.getItem('theme-mode')) {
			if (localStorage.getItem('theme-mode') === 'light') {
				document.documentElement.classList.add('dark')
				localStorage.setItem('theme-mode', 'dark')
			} else {
				document.documentElement.classList.remove('dark')
				localStorage.setItem('theme-mode', 'light')
			}
		} else {
			if (document.documentElement.classList.contains('dark')) {
				document.documentElement.classList.remove('dark')
				localStorage.setItem('theme-mode', 'light')
			} else {
				document.documentElement.classList.add('dark')
				localStorage.setItem('theme-mode', 'dark')
			}
		}
		_themeMode = localStorage.getItem('theme-mode')
		document.documentElement.setAttribute('data-theme', _themeMode!)
		$themeMode = _themeMode!
	}
</script>

<button
	type="button"
	data-tb-dropdown-toggle
	aria-expanded="false"
	class="icon relative grid h-9 w-9 place-content-center rounded text-2xl font-light hover:bg-white/10 aria-expanded:bg-white/20"
>
	<Icon icon="tabler:settings" size="20px" />
</button>

<Dropdown
	triggeredBy="#preferences"
	containerClass="min-w-[350px] rounded-md border border-light-200 bg-white text-body shadow-lg shadow-light-500/20 dark:border-0 dark:bg-dark-200 dark:shadow-black/20"
	class="flex grid h-full grid-cols-3 flex-col gap-3 p-4"
>
	<div slot="header" class="py-2 text-center font-bold">Preferences</div>
	<PreferenceItem
		name="Toggle Fullscreen"
		icon="icon-park:full-screen-one"
		id="fullscreen-toggle"
	/>
	<PreferenceItem
		name="Toggle Dark Mode"
		icon={$themeMode === 'dark' ? 'tabler:sun' : 'tabler:moon'}
		id="theme-toggle"
		on:click={handleDarkMode}
	/>
	<PreferenceItem name="Adjust Page Zoom" icon="fluent-mdl2:zoom-to-fit" id="adjust-page-zoom" />
	<ThemeColorPicker />
</Dropdown>
