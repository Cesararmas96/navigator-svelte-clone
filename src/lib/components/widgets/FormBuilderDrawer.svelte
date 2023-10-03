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

	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'

	let title: string = ''
	let description: string = ''
	let btnText: string = ''
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

	const btnTextMap: any = {
		new: 'Save',
		edit: 'Update',
		view: 'View'
	}

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
			schema = jsonSchema
			title = `${capitalizeWord(record.action)} ${jsonSchema?.title}`
			description = jsonSchema?.description
			btnText = `${record.action === 'delete' ? 'Delete' : btnTextMap[record.action]} ${
				jsonSchema.title
			}`

			if (record?.data) {
				getModelByID(record, slug, conditions)
			}
		}
	}

	async function getModelByID(
		record: Record<string, any>,
		slug: string,
		conditions: Record<string, any>
	) {
		const dataSchema = await getApiData(`${slug}/${record.data}`, 'GET', conditions)

		title = `${capitalizeWord(record.action)} ${schema?.title} #${record.data}`

		if (dataSchema) {
			Object.keys(schema.properties).map((property) => {
				schema.properties[property].default = dataSchema[property]
			})
		}
	}

	async function handleSubmit(payload: any) {
		console.log('submit', payload.detail)

		// const dataModel = await getApiData(
		// 	`${urlBase}/${$selectedFormBuilderWidget.params?.model?.meta}`,
		// 	'PUT',
		// 	payload.detail
		// )

		// if (dataModel) {
		// 	sendSuccessNotification('Successfully created')
		// 	close()
		// }
	}

	function handleErrors(errors: any) {
		console.log('errors', errors.detail)
		sendErrorNotification('There has been a problem...')
	}
</script>

<Drawer
	activateClickOutside={!schema}
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

	<pre>{JSON.stringify(schema, null, 2)}</pre>
</Drawer>
