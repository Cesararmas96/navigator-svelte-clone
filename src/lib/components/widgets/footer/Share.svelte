<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	import { getApiData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')

	const urlBase = import.meta.env.VITE_API_URL
	const token = '' //getApiData(`${urlBase}/api/v2/user/gen_token/35`, 'GET')
</script>

{#await token then token}
	<span class="inline-flex items-center text-sm">
		<a
			href={`/share/widget/${$widget?.dashboard_id}/${$widget?.uid}?token=${token ? token : ''}`}
			target="_blank"
			class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
		>
			<Icon icon="mdi:share-variant" size="18" />
		</a>
	</span>
{/await}
