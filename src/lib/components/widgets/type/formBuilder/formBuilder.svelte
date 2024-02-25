<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { Alert } from 'flowbite-svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification } from '$lib/stores/toast'
	import Icon from '$lib/components/common/Icon.svelte'
	import {
		getJsonSchema,
		getSchemaComputed,
		handleSubmitForm,
		utilFunctionsMap
	} from '$lib/helpers/formbuilder/index'
	import { addInstance, clearInstances } from '$lib/helpers/widget/instances'
	import { merge } from 'lodash-es'

	export let data: any
	const widget: any = getContext('widget')
	const dashboard = getContext<Writable<any>>('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')
	let title: string = ''
	let description: string = ''
	let schema: any
	let schemaBottom: any
	let formBottomWidget: any
	let meta: any
	const baseUrl = import.meta.env.VITE_API_URL
	const token = $storeUser?.token
	let responseServer = null

	async function handleSubmitFormLocal(
		handleValidateForm: any,
		type: string,
		handleResetForm,
		handleSetFormErrors
	) {
		const endpoint = `${schema?.endpoint || meta}`

		const reference = type === 'formBottom' ? formBottomWidget : $widget

		const response = await handleSubmitForm(handleValidateForm, type, reference, {
			baseUrl,
			endpoint,
			handleSetFormErrors
		})

		if (response) {
			if (reference?.params?.model?.responseAlert) {
				if (
					reference?.params?.model?.responseAlert?.callback &&
					utilFunctionsMap[reference?.params?.model?.responseAlert?.callback]
				) {
					responseServer =
						utilFunctionsMap[reference?.params?.model?.responseAlert?.callback](response)
				} else {
					responseServer = response?.response?.message
				}
			}

			if (
				reference?.params?.model?.callback?.form &&
				utilFunctionsMap[reference?.params?.model?.callback?.form]
			) {
				formBottomWidget = utilFunctionsMap[reference.params.model.callback.form]({
					data: response.response,
					params: reference.params.model
				})

				if (formBottomWidget === 'CloseFormBottom') {
					schemaBottom = null
				} else {
					getModel(formBottomWidget, 'bottom')
				}
			}

			handleResetForm()
		}
	}

	async function getModel(reference, _type = 'default') {
		meta =
			reference.params.model && reference.params.model.meta ? reference.params.model.meta : null

		const prepareJsonSchema = await getApiData(`${baseUrl}/${meta}:meta`, 'GET')
		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, reference, { baseUrl, token })

			if (_type === 'bottom') {
				schemaBottom = getSchemaComputed(jsonSchema, reference)
			} else {
				schema = getSchemaComputed(jsonSchema, reference)
			}

			if (_type === 'default') {
				title = `${jsonSchema?.title}`
				description = jsonSchema?.description
			}
		} else {
			sendErrorNotification('The form could not be loaded')
		}
	}

	onMount(() => {
		if ($dashboard?.attributes?.explorer === 'v2') {
			console.log('resizeAction')
			resizeAction.action()
		}

		getModel($widget)
	})

	const showDD = async () => {
		await clearInstances(widget)

		const title = $widget.title

		let drilldowns: Record<string, any>
		drilldowns = {
			...$widget.params.drilldowns,
			title: `${title}`,
			attributes: {},
			classbase: 'EditorWysiwyg',

			dashboard_id: $widget.dashboard_id,
			module_id: $widget.module_id,
			program_id: $widget.program_id,
			widget_type_id: 'media-editor-wysiwyg',
			parent: $widget.widget_id,

			params: {
				settings: merge({}, $widget.params.settings, $widget.params.drilldowns.params?.settings)
			}
		}

		addInstance(widget, drilldowns)
	}
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
					<div
						class="w-full"
						slot="buttons-footer"
						let:handleValidateForm
						let:handleResetForm
						let:handleSetFormErrors
					>
						<div class="flex items-end justify-end">
							<button
								class="btn btn-form text-md"
								on:click={() =>
									handleSubmitFormLocal(
										handleValidateForm,
										'formSaved',
										handleResetForm,
										handleSetFormErrors
									)}
							>
								<Icon icon="tabler:plus" classes="mr-2" />

								{schema && schema.settings && schema.settings.SubmitLabel
									? schema.settings.SubmitLabel
									: 'Save changes'}
							</button>
						</div>
					</div>
				</Form>

				{#if responseServer}
					<div class="pt-6">
						<Alert color="blue" dismissable>
							{@html responseServer}
						</Alert>
					</div>
				{/if}

				{#if schemaBottom}
					<div class="mt-2 flex items-center">
						<h5
							class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
						>
							<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
							{schemaBottom?.title}
						</h5>
					</div>
					<div class="text-sm text-gray-500 dark:text-gray-400">
						{schemaBottom?.description}
					</div>

					<Form schema={schemaBottom}>
						<div
							class="w-full"
							slot="buttons-footer"
							let:handleValidateForm
							let:handleResetForm
							let:handleSetFormErrors
						>
							<div class="flex items-end justify-end">
								<button
									class="btn btn-form text-md"
									on:click={() =>
										handleSubmitFormLocal(
											handleValidateForm,
											'formBottom',
											handleResetForm,
											handleSetFormErrors
										)}
								>
									<Icon icon="tabler:plus" classes="mr-2" />

									{schemaBottom && schemaBottom.settings && schemaBottom.settings.SubmitLabel
										? schemaBottom.settings.SubmitLabel
										: 'Save changes'}
								</button>
							</div>
						</div>
					</Form>
				{/if}
			</div>
			<button class="btn btn-form text-md" on:click={showDD}>DD</button>
		{:else}
			<Loading />
		{/if}
	</div>
{/if}
