<script lang="ts">
	import { page } from '$app/stores'
	import { storeProgram } from '$lib/stores/programs'
	import { onMount } from 'svelte'
	import Icon from '../common/Icon.svelte'
	import { format } from 'date-fns'
	import { storeModule } from '$lib/stores/modules'
	import { Tooltip } from 'flowbite-svelte'

	const createUrl = (item: any) => {
		if (item.attributes?.order === '0') {
			return `/${item.module_name}`
		} else {
			return `/${$page.url.pathname.split('/')[1]}/${item.module_name}`
		}
	}

	let breadcrumb: string
	let breadcrumbs: any[]

	$: trocModule = $storeModule
	$: program = $storeProgram

	$: if (trocModule) {
		breadcrumbs = []

		breadcrumbs.push({
			name: $page.data.program.program_name,
			icon: 'ic:baseline-home',
			order: 0,
			url: createUrl($page.data.program)
		})
		breadcrumbs.push({
			name: trocModule.description,
			icon: trocModule.attributes.icon,
			order: trocModule.attributes.order,
			url: createUrl(trocModule)
		})

		if (trocModule) {
			breadcrumb = trocModule.description
		}
	}

	onMount(() => {
		if (!$storeProgram) $storeProgram = JSON.parse(localStorage.getItem('program')!)
	})

	const handleShareModule = () => {
		const url = `/share/module/${program.program_slug}/${trocModule.module_slug}`
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('target', '_blank')
		link.click()
	}
</script>

<div id="breadcrumb" class="content-header px-5">
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
	{#if $page.data.dashboards.length > 1}
		<Icon icon="mdi:share-variant" classes="ml-3 cursor-pointer" on:click={handleShareModule} />
		<Tooltip>Share module {program.program_name} > {trocModule.description}</Tooltip>
	{/if}
</div>
