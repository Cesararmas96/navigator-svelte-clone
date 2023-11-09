<script lang="ts">
	import { page } from '$app/stores'
	import { storeProgram } from '$lib/stores/programs'
	import { onMount } from 'svelte'
	import Icon from '../common/Icon.svelte'
	import { format } from 'date-fns'
	import { storeModules } from '$lib/stores/modules'

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
				const m = $storeModules.find((item) => item.module_name === slug)
				if (m) {
					breadcrumbs.push({
						name: m.attributes.order === '0' ? $storeProgram?.program_name : m.description,
						icon: m.attributes.icon,
						order: m.attributes.order,
						url: createUrl(m)
					})
				}
			})
		const trocModule = $storeModules.find(
			(item) => item.module_slug === activeUrl.split('/').at(-1)
		)
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
</div>
