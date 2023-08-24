<script lang="ts">
	import { themeColor } from '$lib/stores/preferences'
	import Icon from '../common/Icon.svelte'

	const COLORS = [
		// Following comments related to the color classes are important. DO NOT REMOVE THEM.
		'blue', // text-blue-500 bg-blue-100
		'green', // text-green-500 bg-green-100
		'indigo', // text-indigo-500 bg-indigo-100
		'orange', // text-orange-500 bg-orange-100
		'purple', // text-purple-500 bg-purple-100
		'red', // text-red-500 bg-red-100
		'cyan', // text-cyan-500 bg-cyan-100
		'teal' // text-teal-500 bg-teal-100
	]

	let currentColor = document.documentElement.getAttribute('data-theme-color')

	const handleThemeColor = (color: string) => {
		document.documentElement.setAttribute('data-theme-color', color)
		localStorage.setItem('theme-color', color)
		$themeColor = color
		currentColor = color
	}
</script>

<div
	id="pref-theme-colors"
	class="relative col-span-3 rounded-lg border border-light-200 bg-light-100/50 p-3 text-center transition-colors duration-300 hover:bg-light-100 dark:border-dark-300 dark:bg-dark-300/50 dark:hover:bg-dark-300"
>
	<div class="mb-2 flex items-center justify-center">
		<Icon icon="mdi:brush-variant" size="18px" classes="mr-1" />
		<div class="text-sm font-bold leading-tight text-heading">Theme Color</div>
	</div>
	<div id="theme-color-picker" class="mb-1 flex flex-wrap justify-center gap-1">
		{#each COLORS as color}
			<button
				class="h-6 w-6 overflow-hidden rounded-full border border-current text-{color}-100"
				on:click={() => handleThemeColor(color)}
			>
				<i
					class="grid h-full w-full place-content-center text-base text-transparent"
					style="background-color: rgb(var(--color-{color}))"
				>
					{#if currentColor === color}
						<Icon icon="mdi:check" size="14px" classes="text-white" />
					{/if}
				</i>
			</button>
		{/each}
	</div>
</div>
