<script lang="ts">
	// TODO: Eliminar widget
	import AgGridWidget from '../AgGrid/AgGrid.svelte'

	export let data: any
</script>

<AgGridWidget {data} />
