<script lang="ts">
	import { getApiData } from '$lib/services/getData'
	import {
		hideFormBuilderDrawer,
		selectedFormBuilderWidget,
		selectedFormBuilderRecord
	} from '$lib/stores/widgets'
	import { Button, CloseButton, Drawer } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import Icon from '../common/Icon.svelte'
	import { capitalizeWord } from '$lib/helpers/common/common'
	import { Form } from '@mixoo/form'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import Loading from '$lib/components/common/Loading.svelte'
	import { merge } from 'lodash-es'

	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'
	import { storeUser } from '$lib/stores'

	const baseUrl = import.meta.env.VITE_API_URL
	let primaryKey: string = ''
	const token = $storeUser?.token
	let title: string = ''
	let description: string = ''
	let schema: any
	const urlBase = import.meta.env.VITE_API_URL

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	const close = () => {
		$selectedFormBuilderWidget = null
		$selectedFormBuilderRecord = null
		$hideFormBuilderDrawer = true
		schema = null
		title = ''
		description = ''
		primaryKey = ''
	}

	$: if ($selectedFormBuilderWidget && $selectedFormBuilderRecord) {
		const slug = $selectedFormBuilderWidget.query_slug.slug
		const conditions = $selectedFormBuilderWidget.conditions
		const keys = $selectedFormBuilderWidget?.params?.model?.keys || []
		const data = $selectedFormBuilderRecord?.data

		if ($selectedFormBuilderWidget?.params?.model?.primaryKey) {
			keys.unshift($selectedFormBuilderWidget.params.model.primaryKey)
		}
		console.log(data, keys)
		data &&
			keys.map((key) => {
				if (data[key]) {
					primaryKey = primaryKey.concat('/', data[key])
				}
			})

		getDataModel($selectedFormBuilderRecord, slug, conditions)
	}

	async function getDataModel(
		record: Record<string, any>,
		slug: string,
		conditions: Record<string, any>
	) {
		const jsonSchema = await getApiData(`${slug}:meta`, 'GET', conditions)

		if (jsonSchema) {
			jsonSchema['noHeader'] = true
			title = `${capitalizeWord(record.action)} ${jsonSchema?.title}`
			description = jsonSchema?.description

			Object.keys(jsonSchema.properties).map((property) => {
				if (
					jsonSchema.properties[property]?.$ref &&
					jsonSchema.properties[property]?.type === 'object'
				) {
					jsonSchema.properties[property].type = 'select'

					jsonSchema.properties[property].$ref['_fetch'] = {
						baseUrl: `${baseUrl}/${jsonSchema.properties[property].$ref?.url || 'api/v1/'}`,
						headers: {
							authorization: `Bearer ${token}`
						}
					}
				}

				if (jsonSchema.properties[property]?.type === 'text') {
					jsonSchema.properties[property].type = 'string'
					jsonSchema.properties[property]['format'] = 'textarea'
				}
			})

			if (primaryKey) {
				getModelByID(jsonSchema, record, slug, conditions)
			} else {
				schema = getSchemaComputed(jsonSchema)
			}
		} else {
			sendErrorNotification('The form could not be loaded')
			close()
		}
	}

	async function getModelByID(
		jsonSchema: Record<string, any>,
		record: Record<string, any>,
		slug: string,
		conditions: Record<string, any>
	) {
		const dataSchema = await getApiData(`${slug}${primaryKey}`, 'GET', conditions)

		title = `${capitalizeWord(record.action)} ${jsonSchema?.title} #${primaryKey}`

		if (dataSchema) {
			Object.keys(jsonSchema.properties).map((property) => {
				jsonSchema.properties[property].default = dataSchema[property]
			})
		}

		schema = getSchemaComputed(jsonSchema)
	}

	function getSchemaComputed(jsonSchema: Record<string, any>) {
		return merge({}, jsonSchema, $selectedFormBuilderWidget?.params?.model?.schema || {})
	}

	function handleSubmitForm(handleValidateForm: any, type: string) {
		const payload = handleValidateForm()
		console.log(payload)
		if (!Array.isArray(payload)) {
			handleSubmit(payload, type)
		} else {
			sendErrorNotification('There has been a problem...')
		}
	}

	async function handleSubmit(payload: any, type: string) {
		let url = `${urlBase}/${$selectedFormBuilderWidget.params?.model?.meta}`
		let method = 'PUT'
		let message = 'Successfully created'
		let callback = $selectedFormBuilderRecord.callbackNew

		if (type === 'update') {
			url = `${url}${primaryKey}`
			method = 'POST'
			message = 'Successfully updated'
			callback = $selectedFormBuilderRecord.callbackUpdate
		}

		const dataModel = await getApiData(url, method, payload)

		if (dataModel) {
			callback({
				rowId: $selectedFormBuilderRecord?.rowId,
				dataModel
			})
			sendSuccessNotification(message)
			close()
		} else {
			console.log('Error here', dataModel)
			sendErrorNotification('There has been a problem...')
		}
	}
</script>

<Drawer
	activateClickOutside={false}
	placement="right"
	transitionType="fly"
	{transitionParams}
	bind:hidden={$hideFormBuilderDrawer}
	id="sidebarSettings"
	class="w-[350px] p-0"
>
	<div class="sticky top-0 z-10 flex w-full flex-col bg-inherit bg-white p-2 dark:bg-gray-800">
		<div class="mb-2 flex items-center">
			<h5
				id="drawer-label"
				class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
			>
				<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
				{title}
			</h5>
			<CloseButton on:click={() => close()} class="dark:text-white" />
		</div>
	</div>

	{#if schema}
		<div class="px-4 pb-4">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{description}
			</p>
			<Form {schema}>
				<div slot="buttons-header" let:handleValidateForm>
					{#if $selectedFormBuilderRecord?.action === 'new'}
						<Button
							class="mb-2 mt-3 w-full rounded p-2 text-sm "
							on:click={() => {
								handleSubmitForm(handleValidateForm, 'save')
							}}
						>
							<Icon icon="tabler:plus" classes="mr-1" />Save Changes
						</Button>
					{:else}
						<Button
							class="mb-2 mt-3 w-full rounded p-2 text-sm "
							on:click={() => {
								handleSubmitForm(handleValidateForm, 'update')
							}}
						>
							<Icon icon="tabler:edit" classes="mr-1" />Update Changes
						</Button>

						<Button
							class="mb-2 w-full rounded p-2 text-sm "
							outline
							on:click={() => {
								handleSubmitForm(handleValidateForm, 'saveAsNew')
							}}
						>
							<Icon icon="tabler:plus" classes="mr-1" />Save as New
						</Button>
					{/if}
				</div>
				<div slot="buttons-footer" />
			</Form>
		</div>
	{:else}
		<Loading />
	{/if}

	<!-- <pre>{JSON.stringify(schema, null, 2)}</pre> -->
</Drawer>
