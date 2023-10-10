<script lang="ts">
	import { Button, ButtonGroup, Input, Toggle, Select } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import { modal } from '$lib/helpers/common/modal'
	import Dropdown from '../common/Dropdown.svelte'

	export let props: {
		title?: string
		modules?: any
	}

	const modules = props.modules.map((module: any) => {
		return {
			value: module.module_id,
			name: module.description
		}
	})

	let newOrExisting = false
	let selectedModule: any
	$: console.log(selectedModule)
	// const program = programs.find((element: any) => {
	//   return element?.program_id === module?.program_id
	// })

	// const defaultModule: Record<string, any> = ref({
	//   client_id: 1, //TODO: Improve client id
	//   client_slug: tenant?.client_slug || 'navigator',
	//   program_slug: program?.program_slug,
	//   module: {
	//     program_id: program?.program_id,
	//     module_name: null,
	//     module_slug: null,
	//     classname: null,
	//     active: true,
	//     description: '',
	//     attributes: {
	//       color: '#ffffff',
	//       icon: 'fa fa-desktop',
	//       quick: false,
	//       width: '720',
	//       height: '480',
	//     },
	//   },
	//   is_system: true,
	//   dashboard_id: props.dashboard.dashboard_id,
	// })

	// watch(newOrExisting, () => {
	//   !newOrExisting.value
	//     ? (defaultModule.value.module.description = '')
	//     : (selectedModule.value = null)
	// })

	// async function handleSaveChanges() {
	//   if (newOrExisting.value && defaultModule.value.module.description !== '') {
	//     // This code is for create new module and assign current dashboard
	//     let nameAux = ''
	//     const description: string = defaultModule.value.module.description
	//       .toLowerCase()
	//       .replace(program?.program_slug, '')
	//       .replaceAll(' ', '_')
	//       .replaceAll('-', '_')
	//       .trim()

	//     description.split('_').map((string: string) => {
	//       nameAux = `${nameAux}${string.charAt(0).toUpperCase()}${string.slice(1)}`
	//     })

	//     defaultModule.value.module.classname = `${program?.program_slug
	//       .charAt(0)
	//       .toUpperCase()}${program?.program_slug.slice(1)}${nameAux}`

	//     let name = program?.program_slug
	//     // @ts-ignore
	//     if (!description.toLowerCase() !== 'home') {
	//       name =
	//         description.charAt(0) === '_'
	//           ? `${program?.program_slug}${description}`
	//           : `${program?.program_slug}_${description}`
	//     }

	//     defaultModule.value.module.module_name = name
	//     defaultModule.value.module.module_slug = name

	//     await saveModule(defaultModule.value, name, 'create')
	//   } else if (selectedModule.value) {
	//     // This code is to move current dashboard
	//     const moduleSlug = modulesProgram.find((element: any) => {
	//       return element?.module_id === selectedModule.value
	//     })

	//     await saveModule(
	//       {
	//         module_id: selectedModule.value,
	//         dashboard_id: props.dashboard.dashboard_id,
	//       },
	//       moduleSlug!.module_slug,
	//       'update'
	//     )
	//   }
	// }

	// async function saveModule(
	//   params: Record<string, any>,
	//   redirect: string | undefined = program?.program_slug,
	//   type: string = 'create'
	// ) {
	//   loading.value = true

	//   const { data } = await usePost(`/api/v2/modules`, params)
	//   if (data.value) {
	//     // useNotify(data.value.message || 'Module successfully.', 'success')

	//     if (type === 'update') {
	//       router.push(
	//         `/${program!.program_slug}/${redirect?.replace(
	//           program!.program_slug + '_',
	//           ''
	//         )}`
	//       )
	//     } else {
	//       window.location.href = `/${program!.program_slug}/${redirect?.replace(
	//         program!.program_slug + '_',
	//         ''
	//       )}`
	//     }
	//   } else {
	//     useNotify('Failed to module.')
	//   }

	//   loading.value = false
	// }

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
				bind:selectedValue={selectedModule}
				class="mb-3 w-full !rounded rounded-lg border-gray-300 bg-gray-50 px-2 py-1 pr-9 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-xs"
			/>
		</div>
	{/if}
	<Button color="red" class="mr-2">Save</Button>
</div>
