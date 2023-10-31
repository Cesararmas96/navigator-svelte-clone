<script lang="ts">
	import { Avatar } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import type { Link } from './interface'
	import { getContext, onMount } from 'svelte'
	import { schema } from './setting'

	const widget: any = getContext('widget')

	function createSettings() {
		const schemaLink = structuredClone(schema)

		schemaLink.$defs.format_definition.properties.title.default = $widget?.format_definition?.title
		schemaLink.$defs.format_definition.properties.href.default = $widget?.format_definition?.href
		schemaLink.$defs.format_definition.properties.external.default =
			$widget?.format_definition?.external
		schemaLink.$defs.format_definition.properties.icon.default = $widget?.format_definition?.icon
		schemaLink.$defs.format_definition.properties.description.default =
			$widget?.format_definition?.description

		$widget.schema = schemaLink
	}

	let link: Link = $widget.format_definition
	let hover = false

	$: if ($widget?.saved) {
		setTimeout(() => {
			link = $widget.format_definition
		}, 5)

		$widget.saved = null
	}

	onMount(() => {
		createSettings()
	})
</script>

<a
	href={link?.href}
	target={link?.external ? '_blank' : ''}
	on:mouseenter={() => {
		hover = true
	}}
	on:mouseleave={() => {
		hover = false
	}}
>
	<!-- <Card href={link?.href}> -->
	<div
		class="animate__animated animate__zoomIn mt-6 flex flex-1 justify-between hover:-translate-y-0.5 hover:scale-100"
	>
		<div class="mx-5">
			<h5 class=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{link?.title}
			</h5>
			<p class=" text-lg leading-tight text-gray-700 dark:text-gray-400">
				{link?.description}
			</p>

			<!-- <div class="mt-2">
				<Button href="/">Buy now</Button>
			</div> -->
		</div>

		<div class="mx-5">
			{#if link?.image}
				<Avatar size="lg" src={link.image} />
			{:else}
				<Avatar
					size="lg"
					class={hover ? 'dark:bg-primary-900 bg-primary-700 text-white dark:text-white' : ''}
				>
					<Icon icon={link?.icon || 'tabler:external-link'} size="40px" />
				</Avatar>
			{/if}
		</div>
	</div>
	<!-- </Card> -->
</a>
