<script lang="ts">
	import { generateUID } from '$lib/helpers/common/common'
	import { Select } from 'flowbite-svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let selectorCallback: (inputId: string) => void

	const widget: Writable<any> = getContext('widget')

	let label = $widget.params?.selectorTop?.label
	let selector = $widget.params?.selectorTop.options || []
	let selectorSelected = ''

	const handleSelector = (e) => {
		selectorSelected = e.target.value
		selectorCallback(selectorSelected || '')
	}
</script>

<div class="flex w-full flex-col px-1 py-3">
	<Select
		size="sm"
		class="h-9 max-w-[1/3] py-0 align-middle"
		bind:value={selectorSelected}
		on:change={handleSelector}
		placeholder=""
	>
		<option selected value="">{label}</option>
		{#each selector as { value, name }}
			<option {value}>{name}</option>
		{/each}
	</Select>
</div>
