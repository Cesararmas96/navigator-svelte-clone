<script>
	import '../app.scss'
	import '../app.postcss'
	import 'iconify-icon'
	import Toasts from '$lib/components/common/Toasts.svelte'
	import Modal from '$lib/components/common/Modal.svelte'
	import { initModal } from '$lib/helpers/common/modal'

	initModal()
</script>

<slot />
<Toasts />
<Modal />
