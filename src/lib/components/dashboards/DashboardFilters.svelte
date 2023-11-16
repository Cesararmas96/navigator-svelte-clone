<script>
	import { Accordion, AccordionItem } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
	import Filters from './Filters.svelte'
	import { onMount } from 'svelte'
	import { collapse } from '../../helpers/common/collapse'

	export let open = false

	onMount(() => {
		collapse()
	})
</script>

<div id="dashboard-filters-container" class="my-2 ml-[5px] mr-[10px]">
	<div data-tb-collapse class="rounded-md border border-light-200 px-1 pt-1 dark:border-dark-200">
		<div>
			<button
				class="mb-1 block w-full rounded bg-light-100 px-3 py-2 text-left text-md font-bold text-heading hover:bg-light-200 dark:bg-dark-200 dark:hover:bg-dark-300/50"
				type="button"
				data-tb-collapse-toggle="#accordion-basic-1"
				aria-expanded={open}
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
				class="overflow-visible p-2"
			>
				<Filters />
			</div>
		</div>
	</div>
</div>

<style>
	.slide-up {
		transform: translateY(-100%);
		opacity: 0;
	}
</style>
