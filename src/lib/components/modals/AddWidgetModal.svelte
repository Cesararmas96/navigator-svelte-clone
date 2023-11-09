<script lang="ts">
	import { Button, Popover } from 'flowbite-svelte'
	import { fade } from 'svelte/transition'
	import Loading from '$lib/components/common/Loading.svelte'
	import { getApiData } from '$lib/services/getData'
	import { onMount } from 'svelte'
	import { icons } from '$lib/helpers/common/icons'

	export let props

	let data: any[] = []
	const baseUrl = import.meta.env.VITE_API_URL
	let active = 'All'

	async function loadData() {
		try {
			const { program_id } = props.currentDashboard
			const response = await getApiData(
				`${baseUrl}/api/v2/widgets-template?program_id=${program_id}`,
				'GET'
			)
			if (response) data = response.filter((widget) => widget.attributes?.explorer === 'v3')
		} catch (error: any) {
			console.error('An error occurred:', error.message)
		}
	}

	function getWidgetCategories(templates) {
		const uniqueIds = new Set()

		templates.forEach((item) => {
			if (item.widget_type_id.includes('api-')) {
				item.widget_type_id = item.widget_type_id.replace('api-', '')
			}
			if (item.widget_type_id.includes('-')) {
				item.widget_type_id = item.widget_type_id.replaceAll('-', ' ')
			}

			item.widget_type_id = item.widget_type_id
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')

			uniqueIds.add(item.widget_type_id)
		})

		const categories = [...uniqueIds].sort()

		return categories
	}

	let filteredTemplates
	const handleCategorySearch = async (category, templates) => {
		filteredTemplates = templates.filter((widget) => widget.widget_type_id === category)
		searchTerm = ''
		active = category
		return filteredTemplates
	}

	let searchTerm = ''
	function filterCategories() {
		searchTerm = searchTerm.toLowerCase()
		filteredTemplates = data.filter((template) => {
			return template.widget_name.toLowerCase().includes(searchTerm)
		})

		if (searchTerm === '') {
			filteredTemplates = null
		}
		active = 'All'
	}

	const handleClick = (widget) => {
		props.handleWidgetInsert(widget)
	}

	onMount(() => {
		loadData()
	})
</script>

{#if data && data.length > 0}
	<div class="flex flex-row justify-between">
		<div />
		<input
			type="text"
			class="mb-4 h-8 rounded-md bg-white/75 text-center text-base placeholder:text-muted dark:bg-dark-100/50"
			placeholder="Search template..."
			bind:value={searchTerm}
			on:input={filterCategories}
		/>
	</div>

	<div class="flex">
		<ul class=" mr-2 h-96 w-72 overflow-x-hidden" data-simplebar="modal-add-widget-category">
			<div
				class="group my-1 flex {active === 'All'
					? 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600  dark:hover:bg-primary-500'
					: 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'} flex-row items-center rounded-lg py-1 text-base font-bold hover:shadow"
			>
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					href="#"
					class="btn ml-3 flex-1 flex-wrap"
					on:click={() => {
						filteredTemplates = null
						active = 'All'
					}}
				>
					All
				</a>
			</div>
			{#each getWidgetCategories(data) as category}
				<div
					class="group my-1 flex {active === category
						? 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600  dark:hover:bg-primary-500'
						: 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'} flex-row items-center rounded-lg py-1 text-base font-bold hover:shadow"
				>
					<!-- class:bg-primary-500={active === category} -->
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a
						href="#"
						class="btn ml-3 min-w-max flex-1 flex-wrap"
						on:click={() => handleCategorySearch(category, data)}
					>
						{category}
						<button />
					</a>
				</div>
			{/each}
		</ul>
		<ul class="h-96 w-full overflow-y-auto overflow-x-hidden">
			{#if filteredTemplates && filteredTemplates.length === 0}
				<div class="flex p-10">
					<div class="card m-auto w-full max-w-sm p-8 text-center">
						<img class="mb-4 inline-block w-16" src="/img/misc/coming-soon.svg" alt="" />
						<h5 class="mb-3 text-lg font-bold text-heading">Not found!</h5>
						<div class="">
							We are sorry that the template widget you are looking for does not exist. Please check
							and try again.
						</div>
					</div>
				</div>
			{:else if filteredTemplates}
				{#each filteredTemplates as widget}
					{#if widget.title}
						<button class="flex w-full" on:click={() => handleClick(widget)}>
							<div
								class="group my-1 flex w-full flex-row items-center rounded-lg bg-gray-50 p-2.5 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
							>
								<!-- {widget.attributes.icon} -->

								<img src={icons[widget.attributes.icon]} alt="" width="20" />
								<span class="ml-3 flex-1 flex-wrap text-left">{widget.title}</span>

								<Popover class="w-64 text-sm " transition={fade} params={{ duration: 200 }}>
									{#if widget.description}
										{widget.description}
									{:else}
										{widget.title}
									{/if}
								</Popover>
							</div>
						</button>
					{/if}
				{/each}
			{:else}
				{#each data as widget}
					{#if widget.title}
						<button class="flex w-full" on:click={() => props.handleWidgetInsert(widget)}>
							<div
								class="group my-1 flex w-full flex-row items-start rounded-lg bg-gray-50 p-2.5 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
							>
								<img src={icons[widget.attributes.icon]} alt="" width="20" />
								<!-- {widget.attributes.icon} -->
								<span class="ml-3 flex-1 flex-wrap text-left">{widget.title}</span>

								<Popover class="w-64 text-sm " transition={fade} params={{ duration: 200 }}>
									{#if widget.description}
										{widget.description}
									{:else}
										{widget.title}
									{/if}
								</Popover>
							</div>
						</button>
					{/if}
				{/each}
			{/if}
		</ul>
	</div>{:else}
	<Loading />
{/if}
