<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { hideWidgetSettings, selectedWidgetSettings } from '$lib/stores/widgets'
	import { DropdownItem } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import { saveWidgetSettings } from '$lib/helpers/widget/settings'

	const dispatch = createEventDispatcher()

	let widget: any = getContext('widget')

	export let inMenu: boolean = true

	const handleWidgetSettings = (e: Event) => {
		$selectedWidgetSettings = {
			widget: widget,
			state: 'edit',
			callback: saveWidgetSettings
		}
		$hideWidgetSettings = false
	}
</script>

{#if !inMenu}
	<button
		class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
		on:click={handleWidgetSettings}
	>
		<Icon icon="mdi:cog-outline" size="18" />
	</button>
{:else}
	<DropdownItem class="flex items-center gap-2" on:click={handleWidgetSettings}>
		<Icon icon="mdi:cog-outline" size="18" /> Settings
	</DropdownItem>
{/if}
