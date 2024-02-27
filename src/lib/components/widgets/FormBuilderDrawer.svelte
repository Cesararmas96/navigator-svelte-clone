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
	import { sendErrorNotification } from '$lib/stores/toast'
	import Loading from '$lib/components/common/Loading.svelte'
	import { storeUser } from '$lib/stores'
	import { getJsonSchema, getSchemaComputed, handleSubmitForm } from '$lib/helpers/formbuilder'
	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'

	const baseUrl = import.meta.env.VITE_API_URL
	let primaryKey: string = ''
	const token = $storeUser?.token
	let title: string = ''
	let description: string = ''
	let schema: any

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
		const prepareJsonSchema = await getApiData(`${slug}:meta`, 'GET', conditions)

		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, $selectedFormBuilderWidget, {
				baseUrl,
				token
			})

			if (primaryKey) {
				getModelByID(jsonSchema, record, slug, conditions)
			} else {
				schema = getSchemaComputed(jsonSchema, $selectedFormBuilderWidget)
			}

			if (schema) {
				title = `${capitalizeWord(record.action)} ${jsonSchema?.title}`
				description = jsonSchema?.description
			}
		} else {
			sendErrorNotification('The form could not be loaded')
			close()
		}
	}

	const update = (button) => {
		try {
			// @ts-ignore
			document.querySelector(`#${button}`)?.click()
		} catch (error) {
			sendErrorNotification('An error occurred, please try again later')
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

		schema = getSchemaComputed(jsonSchema, $selectedFormBuilderWidget)
	}

	async function handleSubmitFormLocal(handleValidateForm: any, type: string) {
		const endpoint = `${schema?.endpoint || $selectedFormBuilderWidget.params?.model?.meta}`

		const response = await handleSubmitForm(handleValidateForm, type, $selectedFormBuilderWidget, {
			baseUrl,
			endpoint,
			primaryKey
		})

		if (response) {
			close()
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
		<div class="mb-1 flex items-center">
			<h5
				id="drawer-label"
				class=" inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
			>
				<Icon icon="mdi:widgets-outline" classes="mr-1" size="20px" />
				{title}
			</h5>
			<CloseButton on:click={() => close()} class="dark:text-white" />
		</div>
		<div class="px-2 pb-1 text-sm text-gray-500 dark:text-gray-400">
			{description}
		</div>
	</div>

	{#if schema}
		<div class="flex h-[88%] flex-col">
			<div class="relative flex-grow">
				<div class="absolute h-full w-full overflow-y-auto">
					<div class="px-4 pb-4">
						<Form {schema}>
							<div slot="buttons-header" let:handleValidateForm class="hidden">
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
							<div slot="buttons-footer" />
						</Form>
					</div>
				</div>
			</div>
			<div class="px-2 pb-2">
				<div>
					<div class="px-2 pb-2 text-sm text-gray-500 dark:text-gray-400">
						{#if $selectedFormBuilderRecord?.action === 'new'}
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
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<Loading />
	{/if}

	<!-- <pre>{JSON.stringify(schema, null, 2)}</pre> -->
</Drawer>
