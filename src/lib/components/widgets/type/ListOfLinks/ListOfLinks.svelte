<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { schema } from './setting'

	const widget: any = getContext('widget')
	let data: any = $widget.format_definition?.links || []

	$: if ($widget?.saved) {
		setTimeout(() => {
			data = $widget.format_definition?.links
			createSettings()
		}, 5)

		$widget.saved = null
	}

	function createSettings() {
		const schemaLink = structuredClone(schema)
		schemaLink.$defs.format_definition.default = $widget?.format_definition
		$widget.schema = schemaLink
	}

	onMount(() => {
		createSettings()
	})
</script>

{#if data.length > 0}
	{#if $widget?.params?.body_message}
		<div class="m-3 my-5 text-md font-bold text-heading">
			{$widget.params.body_message}
		</div>
	{/if}
	<div class="m-3 my-5">
		{#each data as item, idx}
			<a href={item.href} target={item?.external ? '_blank' : ''}>
				<div class="group flex cursor-pointer flex-wrap items-center text-heading">
					<div
						class="m-2 grid h-4 w-4 place-content-center rounded-full bg-gray-500 text-sm font-bold text-white group-hover:bg-primary-700"
					>
						{idx + 1}
					</div>
					<div class="flex-1 text-md font-bold group-hover:text-primary-700">{item?.title}</div>
					<div class="font-bold group-hover:text-primary-700">
						<Icon icon={'gg:external'} size="20px" />
					</div>

					<div class="my-2 h-0.5 w-full bg-light-200 dark:bg-dark-200">
						<div class="h-0.5 rounded group-hover:bg-primary-700" style="width: 100%" />
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
