<script lang="ts">
	import { closeModal } from '$lib/helpers/common/modal'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import {
		getJsonSchema,
		getSchemaComputed,
		handleSubmitForm
	} from '$lib/helpers/formbuilder/index'
	import Icon from '../common/Icon.svelte'

	export let props: {
		title?: string
		model?: any
	}
	let title: string = ''
	let description: string = ''
	let schema: any
	let meta: any
	const baseUrl = import.meta.env.VITE_API_URL
	const token = $storeUser?.token

	async function handleSubmitFormLocal(
		handleValidateForm: any,
		type: string,
		handleResetForm,
		handleSetFormErrors
	) {
		const endpoint = `${schema?.endpoint || meta}`

		const response = await handleSubmitForm(handleValidateForm, type, props.model, {
			baseUrl,
			endpoint,
			handleSetFormErrors
		})

		if (response) {
			console.log('response', response)
			closeModal()
		}
	}

	onMount(async () => {
		meta =
			props.model.params.model && props.model.params.model.meta
				? props.model.params.model.meta
				: null

		const prepareJsonSchema = await getApiData(`${baseUrl}/${meta}:meta`, 'GET')
		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, props.model, { baseUrl, token })

			schema = await getSchemaComputed(jsonSchema, props.model)

			if (schema) {
				title = `${jsonSchema?.title}`
				description = jsonSchema?.description
			}
		} else {
			sendErrorNotification('The form could not be loaded')
		}
	})
</script>

<div>
	{#if schema}
		<div class="px-4 pb-4">
			<div class="mb-2 flex items-center">
				<h5
					id="drawer-label"
					class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
				>
					{title}
				</h5>
			</div>
			<div class="text-sm text-gray-500 dark:text-gray-400">
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
							on:click={(event) => {
								event.preventDefault()
								event.stopPropagation()

								handleSubmitFormLocal(
									handleValidateForm,
									'formSaved',
									handleResetForm,
									handleSetFormErrors
								)
							}}
						>
							<Icon icon="tabler:plus" classes="mr-2" />

							{schema && schema.settings && schema.settings.SubmitLabel
								? schema.settings.SubmitLabel
								: 'Save changes'}
						</button>
					</div>
				</div>
			</Form>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
