<script lang="ts">
	import { Input } from 'flowbite-svelte'
	import Icon from '../common/Icon.svelte'
</script>

<div id="search">
	<div class="relative mx-auto flex max-w-3xl flex-1 focus-within:text-heading">
		<Icon
			icon="iconamoon:search-thin"
			classes="btn cursor-default absolute bottom-0 top-0 my-auto font-light transition-colors duration-300"
			size="20px"
		/>
		<Input
			type="text"
			id="search-input"
			class="h-11 w-full rounded border-0 bg-slate-100 bg-white/20 pl-9 pr-4 transition-colors duration-300 placeholder:text-white focus:bg-slate-100 focus:ring-0 focus:placeholder:text-body dark:bg-dark-100 dark:placeholder:text-body dark:focus:ring-0"
			placeholder="Search for files, contacts, photos etc."
		/>
		<Icon
			icon="heroicons:adjustments-horizontal"
			classes="btn absolute bottom-0 right-1.5 top-0 my-auto font-light hover:bg-white/20"
			size="20px"
		/>
	</div>
</div>
