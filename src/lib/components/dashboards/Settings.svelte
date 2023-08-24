<script>
	import { hideDashboardSettings, selectedDashboard, storeDashboards } from '$lib/stores/dashboards'
	import { Drawer, Button, CloseButton, Label, Input, Textarea } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import Icon from '../common/Icon.svelte'

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	}

	const update = () => {
		const tabs = $storeDashboards
		tabs.map((dashboard) => {
			if (dashboard.dashboard_id === $selectedDashboard.dashboard_id) {
				dashboard.description = $selectedDashboard.description
			}
		})
		$storeDashboards = tabs
		$hideDashboardSettings = true
	}
</script>

<Drawer
	activateClickOutside={false}
	placement="right"
	transitionType="fly"
	{transitionParams}
	bind:hidden={$hideDashboardSettings}
	id="sidebarSettings"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<Icon icon="mdi-light:view-dashboard" classes="mr-1" size="20px" />
			Dashboard
		</h5>
		<CloseButton on:click={() => ($hideDashboardSettings = true)} class="mb-4 dark:text-white" />
	</div>
	<form action="#" class="mb-6 mt-5">
		<div class="mb-6">
			<Label for="title" class="mb-2 block">Title</Label>
			<Input
				id="title"
				name="title"
				required
				class="rounded focus:ring-0"
				placeholder="Dashboard title"
				bind:value={$selectedDashboard.description}
			/>
		</div>
		<Button
			class="w-full rounded bg-theme p-2 text-sm text-white hover:bg-blue-600"
			on:click={update}
			><Icon
				icon="streamline:interface-edit-write-2-change-document-edit-modify-paper-pencil-write-writing"
				classes="mr-2"
			/> Update dashboard</Button
		>
	</form>
</Drawer>
