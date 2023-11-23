<script>
	import Icon from '../common/Icon.svelte'
	import Filters from './Filters.svelte'
	import { storeStores } from '$lib/stores/modules'
	import { page } from '$app/stores'
	import Spinner from '../common/Spinner.svelte'

	export let open = false
	console.log('open', open)
	const check = () => {
		if (open) console.log('open')
		open = !open
	}
</script>

<div id="dashboard-filters-container" class="ml-[5px] mr-[10px]">
	<div
		data-tb-collapse
		class="rounded-md border border-gray-200 bg-white px-1 pt-1 dark:border-dark-200 dark:bg-dark-100"
	>
		<div>
			<button
				class="mb-1 block w-full rounded bg-gray-200 px-3 py-2 text-left text-md font-bold text-heading hover:bg-gray-300 dark:bg-dark-200 dark:hover:bg-dark-300/50"
				type="button"
				data-tb-collapse-toggle="#accordion-basic-1"
				aria-expanded={open}
				on:click={() => (open = !open)}
			>
				<div class="flex flex-row">
					<Icon icon="tabler:filter" size="18" />
					<span class="ml-2">Filters</span>
				</div>
			</button>
			<div
				id="accordion-basic-1"
				data-tb-collapse-item
				class:hidden={!open}
				class="overflow-visible"
			>
				{#if $storeStores && $storeStores[$page.params.programs]}
					<Filters drawer={false} />
				{:else}
					<Spinner fullScreen={false} />
				{/if}
			</div>
		</div>
	</div>
</div>
