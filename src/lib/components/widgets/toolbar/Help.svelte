<script lang="ts">
	import { Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
</script>

<DropdownItem class="flex items-center gap-2  ">
	<Icon icon="tabler:help" size="18" /> Help
</DropdownItem>
<Dropdown
	headerClass="w-36"
	placement="left-end"
	class="w-full max-w-sm divide-y divide-gray-100 rounded shadow dark:divide-gray-700 dark:bg-gray-800"
>
	<div slot="header" class=" py-2 text-center font-bold">Help</div>
	<div class="flex space-x-4">
		<div class="w-full px-6 pl-3">
			<div class="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
				{$widget?.description || '...'}
			</div>
		</div>
	</div>
</Dropdown>
