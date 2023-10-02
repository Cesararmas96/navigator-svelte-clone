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
	import WidgetMaximize from '$lib/components/widgets/Maximize.svelte'
	import WidgetFormBuilderDrawer from '$lib/components/widgets/FormBuilderDrawer.svelte'
	import Spinner from '$lib/components/common/Spinner.svelte'

	initModal()
</script>

{#if $navigating}
	<Spinner fullScreen={true} />
{/if}

<slot />
<Toasts />
<Modal />
<WidgetSettings />
<WidgetFormBuilderDrawer />
<WidgetMaximize />
