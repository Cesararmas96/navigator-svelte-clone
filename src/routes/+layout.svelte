<script lang="ts">
	import '../app.scss'
	import '../app.postcss'
	import 'iconify-icon'
	import 'simplebar'
	import 'simplebar/dist/simplebar.min.css'
	import Toasts from '$lib/components/common/Toasts.svelte'
	import Modal from '$lib/components/common/Modal.svelte'
	import { initModal } from '$lib/helpers/common/modal'
	import WidgetSettings from '$lib/components/widgets/Settings.svelte'
	import { page, navigating } from '$app/stores'
	import { Spinner } from 'flowbite-svelte'
	import WidgetMaximize from '$lib/components/widgets/Maximize.svelte'
	import WidgetFormBuilderDrawer from '$lib/components/widgets/FormBuilderDrawer.svelte'

	initModal()
</script>

{#if $navigating}
	<div
		class="fixed left-[calc(50%-2rem)] top-[calc(50%-2rem)] z-50 flex flex-col justify-center gap-2 rounded-md bg-black bg-opacity-40 px-10 py-5"
	>
		<Spinner class="h-16 w-16" />
		<small class="text-center text-white">Loading...</small>
	</div>
{/if}

<slot />
<Toasts />
<Modal />
<WidgetSettings />
<WidgetFormBuilderDrawer />
<WidgetMaximize />
