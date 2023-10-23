<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getApiData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const urlBase = import.meta.env.VITE_API_URL
	let token: any

	const handleApiData = async () => {
		try {
			token = await getApiData(`${urlBase}/api/v2/user/gen_token/35`, 'GET')
			// Now you can use 'token' here
		} catch (error) {
			console.log('ERROR', error)
			sendErrorNotification('error')
		}
	}
</script>

<a
	href={`/share/widget/${$widget?.dashboard_id}/${$widget?.widget_id}`}
	target="_blank"
	on:click={handleApiData}
>
	<DropdownItem class="flex items-center gap-2">
		<Icon icon="mdi:share-variant" size="18" /> Shared
	</DropdownItem>
</a>
