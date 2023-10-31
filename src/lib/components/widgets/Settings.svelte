<script lang="ts">
	import { hideWidgetSettings, selectedWidgetSettings } from '$lib/stores/widgets'
	import { Drawer, CloseButton, Accordion, AccordionItem, Button } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import type { Writable } from 'svelte/store'
	import Icon from '../common/Icon.svelte'
	import { setContext } from 'svelte'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { merge } from 'lodash-es'

	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'

	let widgetSettings: Writable<any>
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	let schema
	let schemaGeneralDefault = {
		$schema: 'https://json-schema.org/draft/2020-12/schema',
		$id: '/schemas/settings',
		additionalProperties: true,
		title: 'Settings',
		description: 'Settings',
		type: 'object',
		table: 'settings',
		schema: 'settings',
		properties: {
			// general
			title: {
				type: 'string',
				label: null,
				attrs: {
					placeholder: null,
					format: null
				},
				readOnly: false,
				// _group: 'general',
				default: ''
			},
			icon: {
				type: 'string',
				label: null,
				attrs: {
					placeholder: null,
					format: null
				},
				readOnly: false,
				// _group: 'general',
				default: ''
			},
			description: {
				type: 'string',
				nullable: true,
				label: null,
				attrs: {
					placeholder: null
				},
				format: 'textarea',
				readOnly: false,
				writeOnly: false,
				// _group: 'general',
				default: ''
			}
		},
		// groups: [
		// 	{ name: 'general', title: 'General' },
		// 	{ name: 'design', title: 'Design' }
		// ],
		noHeader: true
	}

	$: {
		if ($selectedWidgetSettings?.widget && $selectedWidgetSettings?.state === 'edit') {
			widgetSettings = $selectedWidgetSettings.widget

			console.log(JSON.stringify(schemaGeneralDefault))
			console.log(JSON.stringify($widgetSettings?.schema))
			schema = merge({}, schemaGeneralDefault, $widgetSettings?.schema || {})

			// general
			schema.properties.title.default = $widgetSettings?.title
			schema.properties.icon.default = $widgetSettings?.attributes?.icon
			schema.properties.description.default = $widgetSettings?.description
		}
		setContext('widgetSettings', widgetSettings)
	}

	const update = () => {
		try {
			// @ts-ignore
			document.querySelector('#savedWidgetSettings')?.click()
		} catch (error) {
			sendErrorNotification('An error occurred, please try again later')
		}
	}

	function handleSubmitForm(handleValidateForm: any) {
		let payload = handleValidateForm()
		console.log(payload)
		if (!Array.isArray(payload)) {
			// General
			payload = merge({}, payload, { attributes: { icon: payload.icon } })

			$selectedWidgetSettings.callback(widgetSettings, payload)
		} else {
			sendErrorNotification('There has been a problem...')
		}
		close()
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
	<div class="mb-6">
		<div class="sticky top-0 flex w-full flex-col bg-inherit bg-white p-2 dark:bg-gray-800">
			<div class="mb-2 flex items-center">
				<h5
					id="drawer-label"
					class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
				>
					<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
					Widget Settings
				</h5>
				<CloseButton on:click={() => close()} class="dark:text-white" />
			</div>
			<Button class="mb-2 mt-3 w-full rounded p-2 text-sm" on:click={update}
				><Icon
					icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing"
					classes="mr-2"
				/> Update widget</Button
			>
		</div>

		{#if schema}
			<div class="px-4 pb-4">
				<!-- <p class="text-sm text-gray-500 dark:text-gray-400">This is widget settings</p> -->
				<Form {schema}>
					<div slot="buttons-header" let:handleValidateForm>
						<Button
							id="savedWidgetSettings"
							class="mb-2 mt-3 hidden w-full rounded p-2 text-sm"
							on:click={() => {
								handleSubmitForm(handleValidateForm)
							}}
						>
							<Icon icon="tabler:edit" classes="mr-1" />Update Changes
						</Button>
					</div>
					<div slot="buttons-footer" />
				</Form>
			</div>
		{:else}
			<Loading />
		{/if}
	</div>
</Drawer>
