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
	// import { startCase, capitalize, merge, orderBy, map } from 'lodash-es'

	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'

	const baseUrl = import.meta.env.VITE_API_URL
	// TODO: take for session to merged
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTY3OTI5NzAsImlhdCI6MTY5NjQzMjk3MCwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXIiOjE1Nzc5LCJ1c2VybmFtZSI6ImptZW5kb3phMUB0cm9jZ2xvYmFsLmNvbSIsInVzZXJfaWQiOjE1Nzc5LCJpZCI6ImptZW5kb3phMUB0cm9jZ2xvYmFsLmNvbSJ9.cw43iQVJkE6zzGiSfrV-8CCxK-MDkv9ZjOJCyIqkDxg'
	let title: string = ''
	let description: string = ''
	// let btnText: string = ''
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
	}

	// const update = () => {
	// 	console.log('update')
	// 	close()
	// }

	// const btnTextMap: any = {
	// 	new: 'Save',
	// 	edit: 'Update',
	// 	view: 'View'
	// }

	$: if ($selectedFormBuilderWidget && $selectedFormBuilderRecord) {
		const slug = $selectedFormBuilderWidget.query_slug.slug
		const conditions = $selectedFormBuilderWidget.conditions
		const record = $selectedFormBuilderRecord

		getDataModel(record, slug, conditions)
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
			// btnText = `${btnTextMap[record.action]} ${jsonSchema.title}`

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
			})

			if (record?.data) {
				getModelByID(jsonSchema, record, slug, conditions)
			} else {
				schema = jsonSchema
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
		const dataSchema = await getApiData(`${slug}/${record.data}`, 'GET', conditions)

		title = `${capitalizeWord(record.action)} ${jsonSchema?.title} #${record.data}`

		if (dataSchema) {
			Object.keys(jsonSchema.properties).map((property) => {
				jsonSchema.properties[property].default = dataSchema[property]
			})
		}

		schema = jsonSchema
	}

	// function schemaComputed() {
	// 	// TODO: Merge jsonchema with jsonchema bd
	// 	// const a = merge({}, { a: 'a' }, { b: 'b' })
	// 	// console.log(a)
	// }

	async function handleSubmit(payload: any) {
		let url = `${urlBase}/${$selectedFormBuilderWidget.params?.model?.meta}`
		let method = 'PUT'
		let message = 'Successfully created'

		if ($selectedFormBuilderRecord?.action === 'edit') {
			url = `${url}/${$selectedFormBuilderRecord.data}`
			method = 'POST'
			message = 'Successfully updated'
		}

		const dataModel = await getApiData(url, method, payload.detail)

		if (dataModel) {
			sendSuccessNotification(message)
			close()
		} else {
			console.log('Error here', dataModel)
			sendErrorNotification('There has been a problem...')
		}
	}

	function handleErrors(errors: any) {
		console.log('errors', errors.detail)
		sendErrorNotification('There has been a problem...')
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
	<div class="sticky top-0 flex w-full flex-col bg-inherit bg-white p-2 dark:bg-gray-800">
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
		<!-- <Button class="mb-2 mt-3 w-full rounded p-2 text-sm" type="submit" on:click={update}
				><Icon
					icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing"
					classes="mr-2"
				/>{btnText}</Button
			> -->
	</div>

	{#if schema}
		<div class="px-4 pb-4">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{description}
			</p>
			<Form {schema} on:submit={handleSubmit} on:error={handleErrors} />
		</div>
	{:else}
		<Loading />
	{/if}

	<!-- <pre>{JSON.stringify(schema, null, 2)}</pre> -->
</Drawer>
