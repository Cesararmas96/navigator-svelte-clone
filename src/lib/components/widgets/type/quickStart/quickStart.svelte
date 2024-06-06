<script lang="ts">
	import { storeModules } from '$lib/stores/modules'
	import { storeUser } from '$lib/stores'
	import Icon from '$lib/components/common/Icon.svelte'
	import { Tooltip } from 'flowbite-svelte'
	import { page } from '$app/stores'

	export let data = null
	data

	const modules = $storeModules

	const createUrlApikey = (item: Record<string, any>) => {
		let url = `/${$page.url.pathname.split('/')[1]}/${item.module_name}`

		if (item?.attributes?.order === '0') {
			url = `/${item.module_name}`
		}

		return !$storeUser.apikey ? url : `${url}?apikey=${$storeUser.token}`
	}
</script>

<div class="grid grid-cols-12 gap-1">
	{#each modules as module}
		{#if module?.attributes?.quick}
			<a href={createUrlApikey(module)} class="card group col-span-4 p-1 text-blue-500">
				<div class="relative h-20">
					<i class="group block h-20 rounded bg-current opacity-30" />
					<span
						class="icon absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-current opacity-70 group-hover:opacity-100"
					>
						<span class="text-white"> <Icon icon={module?.attributes?.icon} size="30" /> </span>
					</span>
				</div>
				<div class="flex-1 overflow-hidden p-2">
					<div class="text-center text-body group-hover:text-link">{module.description}</div>
					<!-- <div class="text-sm text-muted group-hover:text-link">{module.description}</div> -->
				</div>
			</a>
			<!-- <Tooltip defaultClass="py-2 px-3 text-sm font-medium z-50">
				{module.description}
			</Tooltip> -->
		{/if}
	{/each}
</div>
