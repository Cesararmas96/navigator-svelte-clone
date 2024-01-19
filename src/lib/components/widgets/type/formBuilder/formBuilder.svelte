<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { Button, Alert } from 'flowbite-svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification } from '$lib/stores/toast'
	import Icon from '$lib/components/common/Icon.svelte'
	import {
		getJsonSchema,
		getSchemaComputed,
		handleSubmitForm
	} from '$lib/helpers/formbuilder/index'

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
	let responseServer = null

	async function handleSubmitFormLocal(handleValidateForm: any, type: string) {
		const endpoint = `${schema?.endpoint || meta}`

		const response = await handleSubmitForm(handleValidateForm, type, $widget, {
			baseUrl,
			endpoint
		})

		if (response) {
			if ($widget?.params?.model?.responseAlert) {
				responseServer = response.message
				// 
			}
		}
	}

	onMount(async () => {
		if ($dashboard?.attributes?.explorer === 'v2') {
			console.log('resizeAction')
			resizeAction.action()
		}

		meta = $widget.params.model && $widget.params.model.meta ? $widget.params.model.meta : null

		const prepareJsonSchema = await getApiData(`${baseUrl}/${meta}:meta`, 'GET')
		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, $widget, { baseUrl, token })

			schema = getSchemaComputed(jsonSchema, $widget)

			if (schema) {
				title = `${jsonSchema?.title}`
				description = jsonSchema?.description
			}
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
				<div class="px-2 text-sm text-gray-500 dark:text-gray-400">
					{description}
				</div>

				{#if responseServer}
					<Alert color="blue" dismissable>
						{responseServer}
					</Alert>
				{/if}

				<Form {schema}>
					<div slot="buttons-footer" let:handleValidateForm>
						<div class="flex items-end justify-end">
							<Button
								class="btn-pull-left mt-2 w-full	 rounded text-sm"
								on:click={() => handleSubmitFormLocal(handleValidateForm, 'formSaved')}
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
