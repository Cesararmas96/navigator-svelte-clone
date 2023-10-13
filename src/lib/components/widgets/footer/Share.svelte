<script lang="ts">
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

{#await token then token}
	<span class="mr-3 inline-flex items-center text-sm">
		<a
			href={`/share/widget/${$widget?.dashboard_id}/${$widget?.uid}`}
			target="_blank"
			class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
			on:click={handleApiData}
		>
			<Icon icon="mdi:share-variant" size="18" />
		</a>
	</span>
{/await}
