<script>
	import '../app.scss'
	import '../app.postcss'
	import 'iconify-icon'
	import 'simplebar'
	import 'simplebar/dist/simplebar.min.css'
	import Toasts from '$lib/components/common/Toasts.svelte'
	import Modal from '$lib/components/common/Modal.svelte'
	import { initModal } from '$lib/helpers/common/modal'
	import WidgetSettings from '$lib/components/widgets/Settings.svelte'
	import { navigating } from '$app/stores'
	import WidgetMaximize from '$lib/components/widgets/Maximize.svelte'
	import WidgetFormBuilderDrawer from '$lib/components/widgets/FormBuilderDrawer.svelte'
	import Spinner from '$lib/components/common/Spinner.svelte'
	import { loading, themeColor, themeMode } from '$lib/stores/preferences'
	import { onMount } from 'svelte'

	initModal()

	onMount(() => {
		if (!$themeMode) $themeMode = localStorage.getItem('theme-mode') || 'light'
		$themeColor =
			document.querySelector('html')?.getAttribute('data-theme-color') ||
			localStorage.getItem('theme-color') ||
			'blue'
	})
</script>

{#if $navigating || $loading}
	<Spinner fullScreen={true} />
{/if}

<slot />
<Toasts />
<Modal />
<WidgetSettings />
<WidgetFormBuilderDrawer />
<WidgetMaximize />
