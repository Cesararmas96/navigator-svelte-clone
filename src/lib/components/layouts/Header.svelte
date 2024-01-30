<script lang="ts">
	import { NavBrand } from 'flowbite-svelte'
	import Preferences from '../header/Preferences.svelte'
	import { menuHidden, sidebarMin } from '$lib/stores/sidebar'
	import Profile from '../header/Profile.svelte'
	import { themeColor, themeMode } from '$lib/stores/preferences'
	import { page } from '$app/stores'
	import { iconColor, isIconWhite } from '$lib/helpers/common/common'
	import AnonymousSupport from '../header/AnonymousSupport.svelte'

	$: showToggle = $page.route.id?.includes('programs')
	const toggleDrawer = () => {
		$sidebarMin = true
		$menuHidden = !$menuHidden
	}
</script>

<header
	class="relative z-20 flex h-16 flex-shrink-0 items-center rounded-b-lg bg-theme shadow-md shadow-theme/20 dark:bg-[#1b2931] dark:text-heading dark:shadow-none print:hidden"
	class:text-white={!isIconWhite($themeColor)}
>
	<!-- Logo -->
	<div class="flex flex-shrink-0 items-center px-5 lg:w-[var(--sidebar-width)]">
		{#if showToggle}
			<button
				id="sidebar-toggle"
				type="button"
				class="btn-sidebar-toggle -ml-2 mr-2 grid h-5 w-5 place-content-center rounded font-light hover:bg-white/10 dark:hover:bg-dark-100 xl:hidden"
				on:click={toggleDrawer}
			>
				<img
					src="/images/icons/start{iconColor($themeColor)}.svg"
					alt="Navigator"
					class="btn-sidebar-toggle"
				/>
				<!-- <Icon icon="tabler:layout-sidebar" size="20px" classes="btn-sidebar-toggle" /> -->
			</button>
		{/if}
		<NavBrand href="/home" class="">
			<span class="ml-4 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				{#if $page.params.programs}
					<img
						src="{import.meta.env.VITE_BASE_URL}/assets/img/programs/{$page.params
							.programs}/sidebar.png"
						alt="logo {$page.params.programs}"
						id="logo"
						class={$page.params.programs}
						width="120"
					/>
				{:else}
					<img src="/images/header-logo-troc-{$themeMode}.png" alt="Navigator" width="120" />
				{/if}
			</span>
		</NavBrand>
	</div>
	<!-- Search -->
	<!-- <Search /> -->

	<i class="ml-auto" />

	<!-- Top right menu -->
	<ul class="flex flex-row items-center justify-end px-3 lg:w-[var(--sidebar-width)]">
		<!-- Mobile search toggle -->
		<li class="mx-1 hidden">
			<button
				type="button"
				id="search-toggle"
				class="icon grid h-9 w-9 place-content-center rounded text-2xl font-light hover:bg-white/10 aria-expanded:bg-white/20"
			>
				<svg viewBox="0 0 24 24" fill="none" class="w-4">
					<path
						d="M10.486.986a10.02 10.02 0 0 0-10 10 10.02 10.02 0 0 0 10 10c2.396 0 4.597-.851 6.322-2.264l1.678 1.678 2.985 2.985a1 1 0 0 0 .711.307 1 1 0 0 0 .717-.293 1 1 0 0 0 .293-.717 1 1 0 0 0-.307-.711l-4.663-4.663c1.413-1.725 2.264-3.926 2.264-6.322a10.02 10.02 0 0 0-10-10zm0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</li>

		<!-- Preferences -->
		<li
			id="preferences"
			class="dropdown-header mx-1 block"
			class:hidden={$page.data.trocModule.attributes?.hide_settings}
		>
			<Preferences />
		</li>

		<!-- Profile -->
		<li class="relative mx-1 md:block" class:hidden={$page.data.trocModule.attributes?.hide_menu}>
			<Profile />
		</li>

		<li class:hidden={$page.data.trocModule.attributes?.hide_ticket}>
			<AnonymousSupport />
		</li>

		<li class:hidden={$page.data.trocModule.attributes?.hide_support}>
			<a
				href="https://support.trocdigital.io/"
				target="_blank"
				class="icon mx-2 grid h-6 w-6 place-content-center text-2xl font-light hover:bg-white/10 aria-expanded:bg-white/20"
			>
				<img src="/images/icons/support{iconColor($themeColor)}.svg" alt="Navigator" />
			</a>
		</li>
	</ul>
</header>
