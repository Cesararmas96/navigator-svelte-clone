<script lang="ts">
	import { Dropdown } from 'flowbite-svelte'

	import Icon from '../common/Icon.svelte'
	import PreferenceItem from './PreferenceItem.svelte'
	import { onMount } from 'svelte'
	import { themeColor, themeMode } from '$lib/stores/preferences'
	import ThemeColorPicker from './ThemeColorPicker.svelte'
	import { iconColor } from '$lib/helpers/common/common'
	import { page } from '$app/stores'

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

	let _iconColor = iconColor($themeColor)
	$: if ($themeColor || $themeMode) _iconColor = iconColor($themeColor)

	const setColor = (color: string) => {
		document.documentElement.setAttribute('data-theme-color', color)
		localStorage.setItem('theme-color', color)
		$themeColor = color
	}

	onMount(() => {
		let color = $page.data.program?.attributes?.theme_color
		if (color) {
			localStorage.setItem('backup-theme-color', localStorage.getItem('theme-color') || $themeColor)
			setColor(color)
		} else {
			color = localStorage.getItem('backup-theme-color')
			if (color) {
				localStorage.removeItem('backup-theme-color')
				setColor(color)
			}
		}
	})
</script>

<button
	type="button"
	data-tb-dropdown-toggle
	aria-expanded="false"
	class="icon relative grid h-6 w-6 place-content-center rounded text-2xl font-light hover:bg-white/10 aria-expanded:bg-white/20"
	id="preferences"
>
	<!-- <Icon icon="line-md:cog-loop" size="20px" /> -->
	<img src="/images/icons/settings{_iconColor}.svg" alt="Navigator" />
</button>

<Dropdown
	triggeredBy="#preferences"
	containerClass="min-w-[350px] rounded-md border border-light-200 bg-white text-body shadow-lg shadow-light-500/20 dark:border-0 dark:bg-dark-200 dark:shadow-black/20"
	class="flex grid h-full grid-cols-3 flex-col gap-3 p-4"
>
	<div slot="header" class="py-2 text-center font-bold">Preferences</div>
	<PreferenceItem name="Toggle Fullscreen" icon="tabler:arrows-maximize" id="pref-fullscreen" />
	<PreferenceItem
		name="Toggle Dark Mode"
		icon={$themeMode === 'dark' ? 'tabler:sun' : 'tabler:moon'}
		id="theme-toggle"
		on:click={handleDarkMode}
	/>
	<PreferenceItem name="Adjust Page Zoom" icon="fluent-mdl2:zoom-to-fit" id="pref-zoom" />
	{#if $themeMode !== 'dark' && !$page.data.program?.attributes?.theme_color}
		<ThemeColorPicker />
	{/if}
</Dropdown>
