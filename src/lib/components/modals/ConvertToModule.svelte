<script lang="ts">
	import { Button, Input, Toggle, Select } from 'flowbite-svelte'
	import { storePrograms } from '$lib/stores/programs'
	import { postData } from '$lib/services/getData'
	import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
	import { loading } from '$lib/stores/preferences'
	import { storeModule, storeModules } from '$lib/stores/modules'
	import { goto } from '$app/navigation'

	export let props: {
		title?: string
		module?: any
		dashboard?: any
	}

	const modules = $storeModules.map((module: any) => {
		return {
			value: module.module_id,
			name: module.description
		}
	})

	let newOrExisting = false
	let selectedModule: any

	const program = $storePrograms!.find((element: any) => {
		return element?.program_id === $storeModule?.program_id
	})

	const defaultModule: Record<string, any> = {
		client_id: 1, //TODO: Improve client id
		client_slug: 'navigator', //tenant?.client_slug || 'navigator',
		program_slug: program?.program_slug,
		module: {
			program_id: program?.program_id,
			module_name: null,
			module_slug: null,
			classname: null,
			active: true,
			description: '',
			attributes: {
				color: '#ffffff',
				icon: 'fa fa-desktop',
				quick: false,
				width: '720',
				height: '480'
			}
		},
		is_system: true,
		dashboard_id: props.dashboard.dashboard_id
	}

	$: {
		!newOrExisting ? (defaultModule.module.description = '') : (selectedModule = null)
	}

	const handleSaveChanges = async () => {
		if (newOrExisting && defaultModule.module.description !== '') {
			console.log(defaultModule, program)
			// This code is for create new module and assign current dashboard
			let nameAux = ''
			const description: string = defaultModule.module.description
				.toLowerCase()
				.replace(program?.program_slug, '')
				.replaceAll(' ', '_')
				.replaceAll('-', '_')
				.trim()

			description.split('_').map((string: string) => {
				nameAux = `${nameAux}${string.charAt(0).toUpperCase()}${string.slice(1)}`
			})

			defaultModule.module.classname = `${program?.program_slug
				.charAt(0)
				.toUpperCase()}${program?.program_slug.slice(1)}${nameAux}`

			let name = program?.program_slug
			// @ts-ignore
			if (!description.toLowerCase() !== 'home') {
				name =
					description.charAt(0) === '_'
						? `${program?.program_slug}${description}`
						: `${program?.program_slug}_${description}`
			}

			defaultModule.module.module_name = name
			defaultModule.module.module_slug = name

			await saveModule(defaultModule, name, 'create')
		} else if (selectedModule) {
			// This code is to move current dashboard
			const moduleSlug = $storeModules.find((element: any) => {
				return element?.module_id === selectedModule
			})

			await saveModule(
				{
					module_id: selectedModule,
					dashboard_id: props.dashboard.dashboard_id
				},
				moduleSlug!.module_slug,
				'update'
			)
		}
	}

	async function saveModule(
		params: Record<string, any>,
		redirect: string | undefined = program?.program_slug,
		type: string = 'create'
	) {
		$loading = true

		try {
			const resp = await postData(`${import.meta.env.VITE_API_URL}/api/v2/modules`, params)
			console.log(resp)
			if (resp) {
				sendSuccessNotification(resp.message)
				goto(`/${program!.program_slug}/${redirect}`)

				// if (type === 'update') {
				// 	goto(`/${program!.program_slug}/${redirect?.replace(program!.program_slug + '_', '')}`)
				// 	// router.push(
				// 	// 	`/${program!.program_slug}/${redirect?.replace(program!.program_slug + '_', '')}`
				// 	// )
				// } else {
				// 	goto(`/${program!.program_slug}/${redirect?.replace(program!.program_slug + '_', '')}`)
				// 	window.location.href = `/${program!.program_slug}/${redirect?.replace(
				// 		program!.program_slug + '_',
				// 		''
				// 	)}`
				// }
			} else {
				sendErrorNotification('Failed to module.')
			}
		} catch (e: any) {
			sendErrorNotification(e.message)
		} finally {
			$loading = false
		}
	}

	const moduleText = {
		new: 'New Module',
		existing: 'Existing Module'
	}
</script>

<div class="text-center">
	<div class="flex flex-row justify-between">
		{moduleText[newOrExisting ? 'new' : 'existing']}
		<Toggle
			bind:checked={newOrExisting}
			class="mb-2"
			off-label="Existing Module"
			on-label="New Module"
		/>
	</div>
	{#if newOrExisting}
		<div class="flex flex-col">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="text-left">Module Name</label>
			<Input
				class="mb-3 w-full !rounded rounded-lg border-gray-300 bg-gray-50 px-2 py-1 pr-9 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-xs"
				name=""
				type="text"
				bind:value={defaultModule.module.description}
			/>
		</div>
	{:else}
		<div class="flex flex-col">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="text-left">Module</label>
			<!-- svelte-ignore missing-declaration -->
			<Select
				id="select-sm"
				size="sm"
				items={modules}
				bind:value={selectedModule}
				class="mb-3 w-full !rounded rounded-lg border-gray-300 bg-gray-50 px-2 py-1 pr-9 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-xs"
			/>
		</div>
	{/if}
	<Button color="red" class="mr-2" on:click={handleSaveChanges}>Save</Button>
</div>
