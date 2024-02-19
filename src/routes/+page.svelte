<script>
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { themeColor, themeMode } from '$lib/stores/preferences'

	let loading = true

	onMount(() => {
		// const token = localStorage.getItem('token')
		goto('/home')
		loading = false
	})
</script>

{#if loading}
	<div class="z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
		<div class="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-400" />
	</div>
{/if}
