<script>
	import '../app.scss'
	import '../app.postcss'
	import 'iconify-icon'
	import 'simplebar'
	import 'simplebar/dist/simplebar.min.css'
	import WidgetSettings from '$lib/components/widgets/Settings.svelte'
	import Modal from '$lib/components/common/Modal.svelte'
	import { initModal } from '$lib/helpers/common/modal'

	initModal()
</script>

<slot />

<WidgetSettings />
<Modal />
