<script lang="ts">
	import { Button, Input, Toggle, Select } from 'flowbite-svelte'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { onMount } from 'svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import {
		getJsonSchema,
		getSchemaComputed,
		handleSubmitForm,
		utilFunctionsMap
	} from '$lib/helpers/formbuilder/index'

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
	let responseServer = null

	onMount(async () => {
		meta =
			props.model.params.model && props.model.params.model.meta
				? props.model.params.model.meta
				: null

		const prepareJsonSchema = await getApiData(`${baseUrl}/${meta}:meta`, 'GET')
		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, props.model, { baseUrl, token })

			schema = getSchemaComputed(jsonSchema, props.model)

			if (schema) {
				title = `${jsonSchema?.title}`
				description = jsonSchema?.description
			}
		} else {
			sendErrorNotification('The form could not be loaded')
		}
	})
</script>

<div class="">
	{#if schema}
		<div class="">
			<div class=" ">
				<div class="">
					<div class="px-4 pb-4">
						<Form {schema}>
							<!-- <div slot="buttons-header" let:handleValidateForm class="hidden">
								{#if $selectedFormBuilderRecord?.action === 'new'}
									<Button
										id="formSaved"
										class="mb-2 mt-3 w-full rounded p-2 text-sm "
										on:click={() => {
											handleSubmitFormLocal(handleValidateForm, 'save')
										}}
									>
										<Icon icon="tabler:plus" classes="mr-1" />{schema &&
										schema.settings &&
										schema.settings.showCancel
											? schema.settings.SubmitLabel
											: 'Save changes'}
									</Button>
								{:else}
									<Button
										id="formUpdated"
										class="mb-2 mt-3 w-full rounded p-2 text-sm "
										on:click={() => {
											handleSubmitFormLocal(handleValidateForm, 'update')
										}}
									>
										<Icon icon="tabler:edit" classes="mr-1" />Update Changes
									</Button>

									<Button
										id="formSaveAsNew"
										class="mb-2 w-full rounded p-2 text-sm "
										outline
										on:click={() => {
											handleSubmitFormLocal(handleValidateForm, 'saveAsNew')
										}}
									>
										<Icon icon="tabler:plus" classes="mr-1" />Save as New
									</Button>
								{/if}
							</div>
							<div slot="buttons-footer" /> -->
						</Form>
					</div>
				</div>
			</div>
			<div class="px-2 pb-2">
				<div>
					<div class="px-2 pb-2 text-sm text-gray-500 dark:text-gray-400">
						<!-- {#if $selectedFormBuilderRecord?.action === 'new'}
							<Button class=" mt-3 w-full rounded text-sm" on:click={() => update('formSaved')}>
								<Icon icon="tabler:plus" classes="mr-2" />
								{schema && schema.settings && schema.settings.showSubmit
									? schema.settings.SubmitLabel
									: 'Save changes'}</Button
							>
						{:else}
							<Button class=" mt-3 w-full rounded text-sm" on:click={() => update('formUpdated')}>
								<Icon
									icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing"
									classes="mr-2"
								/> Update Changes</Button
							>

							<Button
								class=" mt-1 w-full rounded text-sm"
								outline
								on:click={() => update('formSaveAsNew')}
							>
								<Icon icon="tabler:plus" classes="mr-2" /> Save as New</Button
							>
						{/if}

						{#if schema && schema.settings && schema.settings.showCancel}
							<Button class=" mt-1 w-full rounded text-sm " outline on:click={() => close()}>
								Cancel
							</Button>
						{/if} -->
					</div>
				</div>
			</div>
		</div>
	{:else}
		<Loading />
	{/if}
</div>
