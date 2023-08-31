<script lang="ts">
	import { page } from '$app/stores'
	import { storeProgram } from '$lib/stores/programs'
	import modulesJson from '../../../data/modules.json'
	import { onMount } from 'svelte'
	import Icon from '../common/Icon.svelte'
	import { format } from 'date-fns'

	const createUrl = (item: any) => {
		if (item.attributes.order === '0') {
			return `/${item.module_name}`
		} else {
			return `/${$page.url.pathname.split('/')[1]}/${item.module_name}`
		}
	}

	$: activeUrl = $page.url.pathname

	let breadcrumb: string
	let breadcrumbs: any[]

	$: {
		breadcrumbs = []
		let slugs = $page.url.pathname.split('/')
		slugs
			.filter((slug) => slug !== '')
			.forEach((slug) => {
				const m = modulesJson.find((item) => item.module_name === slug)
				if (m) {
					breadcrumbs.push({
						name: m.attributes.order === '0' ? $storeProgram?.program_name : m.description,
						icon: m.attributes.icon,
						order: m.attributes.order,
						url: createUrl(m)
					})
				}
			})

		const trocModule = modulesJson.find((item) => item.module_name === activeUrl.split('/').at(-1))
		if (trocModule) {
			breadcrumb = trocModule.description
		}
	}

	let programName: any

	onMount(() => {
		if (!$storeProgram) $storeProgram = JSON.parse(localStorage.getItem('program')!)
	})
</script>

<div class="content-header px-5">
	<div class="flex flex-shrink-0 items-center text-heading">
		<!-- <i class="icon mr-2">public</i>  -->
		<span class="font-bold">{breadcrumb || 404}</span>
	</div>
	<ol class="ml-5 hidden items-center text-md text-muted md:flex">
		{#each breadcrumbs as item, i}
			<Icon icon={i === 0 ? item.icon : 'ic:baseline-keyboard-arrow-right'} classes="mr-1" />
			<li class="rounded p-1">{item.name}</li>
		{/each}
	</ol>
	<i class="ml-auto" />
	<div id="date" class="hidden text-md text-muted lg:block">
		<span>{format(new Date(), 'EEEE, LLLL d, yyyy')}</span>
	</div>
	<nav class="ml-3 hidden items-center text-heading md:flex">
		<button class="btn icon hidden hover:bg-light-200 dark:hover:bg-dark-100 sm:flex">
			<iconify-icon icon="tabler:info-circle" height="14px" />
		</button>
		<button class="btn icon hidden hover:bg-light-200 dark:hover:bg-dark-100 sm:flex">
			<iconify-icon icon="tabler:brand-mixpanel" height="14px" />
		</button>
	</nav>
</div>

<!-- <div class="my-2 flex flex-row">
	<Heading class="w-fit px-4 py-2 text-2xl font-normal leading-none md:border-r" tag="h2"
		>{breadcrumb || 404}</Heading
	>

	<Breadcrumb
		aria-label="Solid background breadcrumb example"
		class="bg-gray-50 px-4 pb-1 pt-3 dark:bg-gray-900"
	>
		{#each breadcrumbs as item}
			<BreadcrumbItem href={item.url} home={item.order === '0'}>
				{item.name}
			</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</div> -->
