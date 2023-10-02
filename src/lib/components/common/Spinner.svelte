<script lang="ts">
	import { Spinner } from 'flowbite-svelte'

	export let fullScreen: boolean
</script>

<div
	class="z-50 flex flex-col items-center justify-center gap-2 rounded-md bg-black bg-opacity-40 px-10 py-5"
	class:fixed={fullScreen}
	class:left-[calc(50%-2rem)]={fullScreen}
	class:top-[calc(50%-2rem)]={fullScreen}
	class:absolute={!fullScreen}
	class:top-0={!fullScreen}
	class:left-0={!fullScreen}
	class:w-full={!fullScreen}
	class:h-full={!fullScreen}
>
	<Spinner class="h-16 w-16" />
	{#if fullScreen}<small class="text-center text-white">Loading...</small>{/if}
</div>
