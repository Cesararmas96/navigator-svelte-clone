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

	import '@mixoo/ui/css/theme/default.css'
	import '@mixoo/form/css/theme/default.css'

	let title: string = ''
	let btnText: string = ''

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	const close = () => {
		$selectedFormBuilderWidget = null
		$selectedFormBuilderRecord = null
		$hideFormBuilderDrawer = true
	}

	const update = () => {
		console.log('update')
		close()
	}

	let schema: any
	let data: any

	const btnTextMap: any = {
		new: 'Save',
		edit: 'Update',
		view: 'View'
	}

	function handleSubmit(payload: any) {
		console.log('submit', payload.detail)
	}

	function handleErrors(errors: any) {
		console.log('errors', errors.detail)
	}

	$: if ($selectedFormBuilderWidget && $selectedFormBuilderRecord) {
		const slug = $selectedFormBuilderWidget.query_slug.slug
		const conditions = $selectedFormBuilderWidget.conditions
		const record = $selectedFormBuilderRecord
		schema = getApiData(`${slug}:meta`, 'GET', conditions)
		data = getApiData(`${slug}/${record.data}`, 'GET', conditions)
		schema.then((s: any) => {
			title = `${capitalizeWord(record.action)} ${s.title}`
			btnText = `${record.action === 'delete' ? 'Delete' : btnTextMap[record.action]} ${s.title}`
		})
	}
</script>

{#await schema then schema}
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

		<div class="px-4">
			<Form {schema} on:submit={handleSubmit} on:error={handleErrors} debug />
		</div>

		<!-- <pre>{JSON.stringify(schema, null, 2)}</pre>
		{#await data then data}
			<pre>{JSON.stringify(data, null, 2)}</pre>
		{/await} -->
	</Drawer>
{/await}
