<script lang="ts">
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte'
	import { page } from '$app/stores'
	import Icon from '../common/Icon.svelte'
	import { menuHidden, sidebarMin } from '$lib/stores/sidebar'

	interface menuItem {
		type: string
		name: string
		icon: string
		order: number
		url?: string
		new: boolean
		childs: menuItem[]
	}

	$: activeUrl = $page.url.pathname

	export let menu: any[]

	const createUrl = (item: any) => {
		if (item.attributes.order === '0') {
			return `/${item.module_name}`
		} else {
			return `/${$page.url.pathname.split('/')[1]}/${item.module_name}`
		}
	}

	let parentMenu: menuItem[] = menu
		.filter((item) => !item.attributes.menu_type || item.attributes.menu_type === 'parent')
		.map((item) => {
			if (item.attributes.menu_type === 'parent') {
				return {
					type: item.attributes.menu_type,
					name: item.attributes.parent_menu,
					icon: item.attributes.icon,
					order: item.attributes.order,
					new: false,
					childs: menu
						.filter((child) => child.attributes.menu_id === item.attributes.menu_id)
						.map((child) => newMenuItem(child))
						.sort((a, b) => a.order - b.order)
				}
			}
			return newMenuItem(item)
		})
		.sort((a, b) => a.order - b.order)

	function newMenuItem(item: any) {
		return {
			type: 'item',
			name: item.description,
			icon: item.attributes.icon,
			order: item.attributes.order,
			url: createUrl(item),
			new: false,
			childs: []
		}
	}

	function handleDrawer(event: any) {
		if (event.target.localName === 'iconify-icon' && !event.target.nextElementSibling) {
			$sidebarMin = !$sidebarMin
			event.preventDefault()
		}
	}
</script>

<Sidebar
	id="sidebar"
	asideClass="max-w-[240px] max-h-[calc(100vh)] max-xl:can-toggle {$sidebarMin
		? 'sidebar-min'
		: ''} 
		{$menuHidden ? '' : 'sidebar-toggled'}"
>
	<SidebarWrapper divClass="px-3 py-4" data-simplebar>
		<SidebarGroup>
			<SidebarItem
				label="Return to programs"
				href="/home"
				class="hover:bg-wite/10 px-3 py-2"
				spanClass="flex-1 text-left menu-text ml-3 whitespace-nowrap"
				on:click={handleDrawer}
			>
				<svelte:fragment slot="icon">
					<Icon icon="tabler:arrow-back-up-double" />
				</svelte:fragment>
				<svelte:fragment slot="subtext">
					<Icon
						icon="carbon:radio-button{!$sidebarMin ? '-checked' : ''}"
						classes="max-xl:hidden"
					/>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup ulClass="space-y-0" border>
			{#each parentMenu as item}
				{#if item.type === 'parent'}
					<SidebarDropdownWrapper
						label={item.name}
						class="px-3 py-2"
						ulClass="space-y-0 {$sidebarMin ? 'sub-menu-active' : ''}"
						spanClass="ml-3 whitespace-nowrap menu-text flex-1 text-left"
					>
						<svelte:fragment slot="icon">
							<Icon icon={item.icon} />
						</svelte:fragment>
						<svelte:fragment slot="arrowup">
							<Icon icon="uil:angle-up" size="16px" />
						</svelte:fragment>
						<svelte:fragment slot="arrowdown">
							<Icon icon="uil:angle-down" size="16px" />
						</svelte:fragment>
						{#each item.childs as child}
							<SidebarDropdownItem
								label={child.name}
								href={child.url}
								active={activeUrl === child.url}
							/>
						{/each}
					</SidebarDropdownWrapper>
				{:else}
					<SidebarItem
						label={item.name}
						href={item.url}
						active={activeUrl === item.url}
						class="px-3 py-2"
						spanClass="flex-1 ml-3 whitespace-nowrap menu-text"
					>
						<svelte:fragment slot="icon">
							<Icon icon={item.icon} />
						</svelte:fragment>
						<svelte:fragment slot="subtext">
							{#if item.new}
								<span
									class="bg-primary-500 dark:bg-primary-500 ml-3 inline-flex items-center justify-center rounded-full px-2 text-sm font-medium text-gray-800"
									>New</span
								>
							{/if}
						</svelte:fragment>
					</SidebarItem>
				{/if}
			{/each}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
