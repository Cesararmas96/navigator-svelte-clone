<script lang="ts">
	import { YouTube } from 'sveltekit-embed'

	export let data: any
</script>

<YouTube youTubeId={data} />
