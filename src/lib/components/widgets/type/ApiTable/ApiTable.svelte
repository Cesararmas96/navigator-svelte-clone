<script lang="ts">
	import AgGridWidget from '../AgGrid/AgGrid.svelte'

	export let data: any
</script>

<AgGridWidget {data} simpleTable={true} />
