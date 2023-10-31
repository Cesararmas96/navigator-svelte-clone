<script lang="ts">
	import TreeView from './TreeView.svelte'

	export let path
</script>

<TreeView {path} on:select />
