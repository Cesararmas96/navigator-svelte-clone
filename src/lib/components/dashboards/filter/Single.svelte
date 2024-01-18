<script lang="ts">
	import Dropdown from '$lib/components/common/Dropdown.svelte'

	export let value: any
	export let selectedValue: any
</script>

<Dropdown
	items={value.items}
	{selectedValue}
	label={value.name}
	defaultClass="w-full"
	labelClass="mb-0"
	reset={value.reset}
	disabled={value.disabled}
	on:change
/>
