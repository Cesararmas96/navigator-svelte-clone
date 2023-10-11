<script lang="ts">
	import { iconEquivalences } from '$lib/utils/migrateFontawesome'

	export let icon: string
	export let size: string = '14px'
	export let classes: string = ''

	icon = icon?.indexOf('fa') === 0 ? iconEquivalences[icon] : icon
</script>

<iconify-icon {icon} height={size} class={classes} />
