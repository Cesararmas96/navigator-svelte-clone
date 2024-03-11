<script lang="ts">
	import { storeProgram } from '$lib/stores/programs'
	import { goto } from '$app/navigation'
	import { Tooltip } from 'flowbite-svelte'

	const baseUrl = import.meta.env.VITE_BASE_URL

	export let program: any

	const handleClickProgram = (program: any) => {
		if (program?.attributes?.url) {
			window.open(program.attributes.url)
			return
		}

		storeProgram.set(program)
		localStorage.setItem('program', JSON.stringify(program))
		goto(`/${program.program_slug}`)
	}

	const loaded = new Map()

	$: visible = true

	function lazy(node: any, data: any) {
		if (loaded.has(data.src)) {
			node.setAttribute('src', data.src)
		} else {
			const img = new Image()
			img.src = data.src
			img.onload = () => {
				loaded.set(data.src, img)
				node.setAttribute('src', data.src)
				visible = true
			}
		}
		return {
			destroy() {} // noop
		}
	}
</script>

{#if !visible}
	<img
		alt=""
		class="h-auto w-full rounded-md object-cover object-center dark:bg-gray-900"
		use:lazy={{
			src: `${baseUrl}/assets/img/programs/${program.program_slug}/${program.program_slug}-home.png`
		}}
	/>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="animate__animated animate__zoomIn card cursor-pointer p-6 hover:-translate-y-1 hover:scale-100 hover:shadow-lg"
		on:click={() => handleClickProgram(program)}
	>
		<img
			alt=""
			class="h-auto w-full rounded-md object-cover object-center dark:bg-gray-900"
			use:lazy={{
				src: `${baseUrl}/assets/img/programs/${program.program_slug}/${program.program_slug}-home.png`
			}}
		/>
		<div class="mb-2 mt-6">
			<h3 class="tracki text-center text-lg font-semibold uppercase">{program.program_name}</h3>
		</div>
	</div>
	{#if program?.attributes?.tooltip}
		<Tooltip class="z-10">{program?.attributes?.tooltip}</Tooltip>
	{/if}
{/if}
