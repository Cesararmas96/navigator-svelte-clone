<script lang="ts">
	import { enhance } from '$app/forms'
	import { storeUser } from '$lib/stores'
	import { iconColor } from '$lib/helpers/common/common'
	import { themeColor, themeMode } from '$lib/stores/preferences'
	import {
		hideFormBuilderDrawer,
		selectedFormBuilderRecord,
		selectedFormBuilderWidget
	} from '$lib/stores/widgets'

	const openDrawerAnonymousSupport = () => {
		$selectedFormBuilderWidget = {
			params: {
				model: {
					url: '/',
					meta: 'support/api/v1/anon_ticket',
					primaryKey: 'title',
					responseAlert: true,
					schema: {
						properties: {
							preferred_contact: {
								type: 'select'
							}
						}
					}
				}
			},
			query_slug: {
				slug: '{BASE_URL_API}/support/api/v1/anon_ticket'
			}
		}
		$selectedFormBuilderRecord = {
			action: 'new'
		}
		$hideFormBuilderDrawer = false
	}

	let _iconColor = iconColor($themeColor)
	$: if ($themeColor || $themeMode) _iconColor = iconColor($themeColor)
</script>

<button
	class="icon mx-2 grid h-6 w-6 place-content-center text-2xl font-light hover:bg-white/10 aria-expanded:bg-white/20"
	on:click={() => openDrawerAnonymousSupport()}
>
	<img src="/images/icons/bell{_iconColor}.svg" alt="Navigator" />
</button>
