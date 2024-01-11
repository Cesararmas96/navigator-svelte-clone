<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { Button } from 'flowbite-svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { merge } from 'lodash-es'
	import Icon from '$lib/components/common/Icon.svelte'

	export let data: any

	const widget: any = getContext('widget')
	const dashboard = getContext<Writable<any>>('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')
	let title: string = ''
	let description: string = ''
	let schema: any
	let meta: any
	const baseUrl = import.meta.env.VITE_API_URL
	const token = $storeUser?.token

	function getSchemaComputed(jsonSchema: Record<string, any>) {
		if ($widget?.params?.model?.schema?.$withoutDefs && jsonSchema?.$defs) {
			delete jsonSchema.$defs
		}

		return merge({}, jsonSchema, $widget?.params?.model?.schema || {})
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
		const endpoint = `${schema?.endpoint || meta}`

		let url = `${baseUrl}/${endpoint}`
		let method = 'PUT'
		let message = 'Successfully created'
		let callback = $widget.callbackNew

		const dataModel = await getApiData(url, method, payload)

		if (dataModel) {
			sendSuccessNotification(dataModel?.message || message)
		} else {
			console.log('Error here', dataModel)
			sendErrorNotification('There has been a problem...')
		}
	}

	onMount(async () => {
		if ($dashboard?.attributes?.explorer === 'v2') {
			console.log('resizeAction')
			resizeAction.action()
		}

		meta = $widget.params.model && $widget.params.model.meta ? $widget.params.model.meta : null

		const jsonSchema = await getApiData(`${baseUrl}/${meta}:meta`, 'GET')

		if (jsonSchema) {
			jsonSchema['noHeader'] = true
			title = `${jsonSchema?.title}`
			description = jsonSchema?.description

			Object.keys(jsonSchema.properties).map((property) => {
				if (
					jsonSchema.properties[property]?.$ref?.api &&
					jsonSchema.properties[property]?.type === 'object'
				) {
					jsonSchema.properties[property].type = 'select'

					jsonSchema.properties[property].$ref['_fetch'] = {
						baseUrl: `${baseUrl}/${
							$widget?.params?.model?.schema?.properties &&
							$widget?.params?.model?.schema?.properties[property]
								? $widget?.params?.model?.schema?.properties[property]?.$ref?.url
								: 'api/v1/'
						}`,
						headers: {
							authorization: `Bearer ${token}`
						}
					}

					delete jsonSchema.properties[property]?.$ref?.$ref
				}

				if (
					jsonSchema.properties[property]?.type === 'text' ||
					jsonSchema.properties[property]?.['ui:widget'] === 'textarea'
				) {
					jsonSchema.properties[property].type = 'string'
					jsonSchema.properties[property]['format'] = 'textarea'
				}

				if (jsonSchema.properties[property]?.type === 'datetime') {
					jsonSchema.properties[property].attrs.visible = false
				}

				if (jsonSchema.properties[property]?.['ui:widget'] === 'ImageUploader') {
					// TODO: improve
					jsonSchema.properties[property].type = 'upload'

					delete jsonSchema.properties[property].attrs.placeholder

					jsonSchema.properties[property].attrs['fetching'] = {
						url: `${baseUrl}/services/files/static/images/badges/`,
						method: 'PUT',
						payload: 'file_name',
						headers: {
							authorization: `Bearer ${token}`
						}
					}

					if (jsonSchema.properties[property]?.['ui:help'])
						jsonSchema.properties[property].attrs.help =
							jsonSchema.properties[property]?.['ui:help']
				}
			})

			schema = getSchemaComputed(jsonSchema)
		} else {
			sendErrorNotification('The form could not be loaded')
		}
	})
</script>

{#if data}
	<div class="m-2 gap-1">
		<div class="" />

		{#if schema}
			<div class="px-4 pb-4">
				<div class="mb-2 flex items-center">
					<h5
						id="drawer-label"
						class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
					>
						<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
						{title}
					</h5>
				</div>
				<div class="px-2 pb-2 text-sm text-gray-500 dark:text-gray-400">
					{description}
				</div>

				<Form {schema}>
					<div slot="buttons-footer" let:handleValidateForm>
						<div class="flex items-end justify-end">
							<Button
								class="btn-pull-left mt-2 w-full	 rounded text-sm"
								on:click={() => handleSubmitForm(handleValidateForm, 'formSaved')}
							>
								<Icon icon="tabler:plus" classes="mr-2" />

								{schema && schema.settings && schema.settings.showCancel
									? schema.settings.SubmitLabel
									: 'Save changes'}
							</Button>
						</div>
					</div>
				</Form>
			</div>
		{:else}
			<Loading />
		{/if}
	</div>
{/if}
