<script lang="ts">
	import { page } from '$app/stores'
	import { storeProgram, variablesOperationalProgram } from '$lib/stores/programs'
	import { getContext, onMount } from 'svelte'
	import Icon from '../common/Icon.svelte'
	import { storeModule } from '$lib/stores/modules'
	import { Tooltip } from 'flowbite-svelte'
	import moment from 'moment'
	import type { Writable } from 'svelte/store'

	const dashboard: Writable<any> = getContext('dashboard')

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

	function handleOperationalDate() {
		try {
			const module = $page.data.trocModule
			const variables = $variablesOperationalProgram

			let moduleOperationalDate = null
			let dashboardOperationalDate = null
			try {
				moduleOperationalDate =
					module && module.attributes ? module.attributes.operational_date : null
				dashboardOperationalDate =
					$dashboard && $dashboard?.attributes ? $dashboard?.attributes?.operational_date : null
			} catch (error) {
				console.log(error)
			}

			return dashboardOperationalDate && moment(dashboardOperationalDate).isValid()
				? dashboardOperationalDate
				: moduleOperationalDate && moment(moduleOperationalDate).isValid()
				? moduleOperationalDate
				: dashboardOperationalDate && variables[dashboardOperationalDate]
				? variables[dashboardOperationalDate]
				: moduleOperationalDate && variables[moduleOperationalDate]
				? variables[moduleOperationalDate]
				: moment().format('YYYY-MM-DD')
		} catch (error) {
			return moment().format('YYYY-MM-DD')
		}
	}

	let date: any = new Date() //handleOperationalDate()
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
	<div class="hidden text-md text-muted lg:block">
		<span>Last updated on {moment(date).format('LL')}</span>
	</div>
	{#if $page.data.dashboards?.length > 1}
		<Icon icon="mdi:share-variant" classes="ml-3 cursor-pointer" on:click={handleShareModule} />
		<Tooltip placement="left"
			>Share module {program.program_name} > {trocModule.description}</Tooltip
		>
	{/if}
</div>
