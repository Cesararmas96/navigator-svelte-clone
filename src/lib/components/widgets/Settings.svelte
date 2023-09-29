<script lang="ts">
	import { hideWidgetSettings, selectedWidgetSettings } from '$lib/stores/widgets'
	import { Drawer, CloseButton, Accordion, AccordionItem, Button } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import { enhance } from '$app/forms'
	import { writable } from 'svelte/store'
	import Icon from '../common/Icon.svelte'
	import SettingsGeneral from './settings/General.svelte'
	import SettingsAppearance from './settings/Appearance.svelte'
	import SettingsHeader from './settings/Header.svelte'
	import { setContext } from 'svelte'
	import SettingsToolbar from './settings/Toolbar.svelte'
	import SettingsFooter from './settings/Footer.svelte'
	import SettingsType from './settings/Type.svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'

	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	const patternHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	let defaultSettings = {
		title: '',
		description: '',
		attributes: {
			icon: 'mdi:widgets-outline'
		},
		params: {
			settings: {
				general: {
					draggable: true,
					resizable: true,
					scrollable: true,
					fixed: false
				},
				appearance: {
					background: '#ffffff',
					backgroundRGB: '255, 255, 255',
					color: '#37507f',
					opacity: 100,
					border: true
				},
				header: {
					show: true,
					title: true,
					icon: true
				},
				toolbar: {
					show: true,
					close: true,
					reload: true,
					filtering: true,
					clone: true,
					help: true,
					export: true,
					screenshot: true,
					max: true,
					share: true,
					pin: true,
					like: true,
					comments: true
				},
				footer: {
					show: true,
					share: true,
					like: true,
					comments: true
				}
			}
		}
	}

	let widgetSettings = writable(defaultSettings)

	$: {
		if ($selectedWidgetSettings?.widget && $selectedWidgetSettings?.state === 'edit') {
			$widgetSettings = $selectedWidgetSettings.widget
			if ($selectedWidgetSettings?.widget?.params?.settings) {
				$widgetSettings.params = { settings: $selectedWidgetSettings?.widget?.params?.settings }
				if (!$widgetSettings.params.settings.general)
					$widgetSettings.params.settings.general = defaultSettings.params.settings.general
				if (!$widgetSettings.params.settings.appearance)
					$widgetSettings.params.settings.appearance = defaultSettings.params.settings.appearance
				if (!$widgetSettings.params.settings.header)
					$widgetSettings.params.settings.header = defaultSettings.params.settings.header
				if (!$widgetSettings.params.settings.toolbar)
					$widgetSettings.params.settings.toolbar = defaultSettings.params.settings.toolbar
				if (!$widgetSettings.params.settings.footer)
					$widgetSettings.params.settings.footer = defaultSettings.params.settings.footer
			} else {
				$widgetSettings.params = { settings: defaultSettings.params.settings }
			}
		}
		setContext('widgetSettings', widgetSettings)
	}

	const update = () => {
		try {
			hexToRGB()
			$selectedWidgetSettings = { widget: $widgetSettings, state: 'saved' }
			$hideWidgetSettings = true
			sendSuccessNotification('Updated widget')
		} catch (error) {
			sendErrorNotification('An error occurred, please try again later')
		}
	}

	const hexToRGB = () => {
		const bg = $widgetSettings.params.settings.appearance.background
		if (patternHex.test(bg)) {
			const r = parseInt(bg.slice(1, 3), 16)
			const g = parseInt(bg.slice(3, 5), 16)
			const b = parseInt(bg.slice(5, 7), 16)
			$widgetSettings.params.settings.appearance.backgroundRGB = `${r}, ${g}, ${b}`
		} else if (patternUrl.test(bg)) {
			$widgetSettings.params.settings.appearance.backgroundRGB = ''
		} else {
			$widgetSettings.params.settings.appearance.background = '#ffffff'
			$widgetSettings.params.settings.appearance.backgroundRGB = '255, 255, 255'
		}
	}

	const close = () => {
		$selectedWidgetSettings = null
		$hideWidgetSettings = true
	}
</script>

<Drawer
	activateClickOutside={false}
	placement="right"
	transitionType="fly"
	{transitionParams}
	bind:hidden={$hideWidgetSettings}
	id="sidebarSettings"
	class="w-[350px] p-0"
>
	<form method="POST" class="mb-6" action="?/create" use:enhance>
		<div class="sticky top-0 flex w-full flex-col bg-inherit bg-white p-2 dark:bg-gray-800">
			<div class="mb-2 flex items-center">
				<h5
					id="drawer-label"
					class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
				>
					<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
					Widget
				</h5>
				<CloseButton on:click={() => close()} class="dark:text-white" />
			</div>
			<Button class="mb-2 mt-3 w-full rounded p-2 text-sm" type="submit" on:click={update}
				><Icon
					icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing"
					classes="mr-2"
				/> Update widget</Button
			>
		</div>
		{#if $widgetSettings}
			<Accordion class="p-2">
				<AccordionItem
					open
					borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
				>
					<span slot="header" class="flex gap-2 text-base">
						<Icon icon="mdi:cog-outline" size="18" />
						<span>General</span>
					</span>
					<div slot="arrowup">
						<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
					</div>
					<span slot="arrowdown">
						<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
					</span>
					<SettingsGeneral />
				</AccordionItem>
				<AccordionItem
					borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
				>
					<span slot="header" class="flex gap-2 text-base">
						<Icon icon="mdi:cog-outline" size="18" />
						<span>Appearance</span>
					</span>
					<div slot="arrowup">
						<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
					</div>
					<span slot="arrowdown">
						<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
					</span>
					<SettingsAppearance />
				</AccordionItem>
				<AccordionItem
					borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
				>
					<span slot="header" class="flex gap-2 text-base">
						<Icon icon="mdi:cog-outline" size="18" />
						<span>Widget type</span>
					</span>
					<div slot="arrowup">
						<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
					</div>
					<span slot="arrowdown">
						<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
					</span>
					<SettingsType />
				</AccordionItem>
				{#if !$widgetSettings.params.settings.general.fixed}
					<AccordionItem
						borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
					>
						<span slot="header" class="flex gap-2 text-base">
							<Icon icon="mdi:cog-outline" size="18" />
							<span>Header</span>
						</span>
						<div slot="arrowup">
							<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
						</div>
						<span slot="arrowdown">
							<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
						</span>
						<SettingsHeader />
					</AccordionItem>
					{#if $widgetSettings.params.settings.header.show}
						<AccordionItem
							borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
						>
							<span slot="header" class="flex gap-2 text-base">
								<Icon icon="mdi:cog-outline" size="18" />
								<span>Toolbar</span>
							</span>
							<div slot="arrowup">
								<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
							</div>
							<span slot="arrowdown">
								<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
							</span>
							<SettingsToolbar />
						</AccordionItem>
					{/if}
					<AccordionItem
						borderOpenClass="p-2 border-l border-r border-b border-gray-200 dark:border-gray-700"
					>
						<span slot="header" class="flex gap-2 text-base">
							<Icon icon="mdi:cog-outline" size="18" />
							<span>Footer</span>
						</span>
						<div slot="arrowup">
							<Icon icon="mdi:chevron-double-up" size="20" classes="mt-1" />
						</div>
						<span slot="arrowdown">
							<Icon icon="mdi:chevron-double-down" size="20" classes="mt-1" />
						</span>
						<SettingsFooter />
					</AccordionItem>
				{/if}
			</Accordion>
		{/if}
	</form>
</Drawer>
