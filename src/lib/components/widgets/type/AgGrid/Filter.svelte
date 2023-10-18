<script lang="ts">
	import { Input, Label } from 'flowbite-svelte'

	export let filterCallback: (inputId: string) => void
</script>

<div class="flex flex-col px-1 py-3">
	<!-- <Label for="filter-text-box" class="mb-1">Filter:</Label> -->
	<Input
		type="text"
		id="filter-text-box"
		defaultClass="w-[300px] !py-1 !px-2 !rounded rounded-lg border-gray-300 bg-gray-50 px-2 py-1 pr-9 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-md"
		placeholder="Filter..."
		on:input={() => filterCallback('filter-text-box')}
		on:click={(e) => {
			e.preventDefault()
			e.stopPropagation()
		}}
		on:focus={() => console.log('focus')}
		on:keypress={() => filterCallback('filter-text-box')}
	/>
</div>
