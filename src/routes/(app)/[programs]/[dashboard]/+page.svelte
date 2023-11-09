<script lang="ts">
	import Module from '$lib/components/modules/Module.svelte'

	export const ssr = false

	export let data
</script>

<Module trocModule={data.trocModule} />
