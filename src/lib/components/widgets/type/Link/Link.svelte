<script lang="ts">
	import { Avatar } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import type { Link } from './interface'
	import { getContext, onMount } from 'svelte'
	import { schema } from './setting'
	import type { Writable } from 'svelte/store'
	import { getWidgetAction } from '$lib/helpers'

	const widget: any = getContext('widget')
	let link: Link = $widget.format_definition

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

	$: if ($widget?.saved) {
		setTimeout(() => {
			link = $widget.format_definition
			createSettings()
		}, 5)

		$widget.saved = null
	}

	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	onMount(() => {
		createSettings()
		const resizeAction = getWidgetAction($widgetActions, 'resize')
		resizeAction.action()
	})
</script>

<a href={link?.href} target={link?.external ? '_blank' : ''}>
	<!-- <Card href={link?.href}> -->
	<div
		class="animate__animated animate__zoomIn group mt-6 flex flex-1 justify-between hover:-translate-y-0.5 hover:scale-100"
	>
		<div class="mx-5">
			<h5
				class=" text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary-700 dark:text-white"
			>
				{link?.title}
			</h5>
			<p
				class=" text-lg leading-tight text-gray-700 group-hover:text-primary-400 dark:text-gray-400"
			>
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
				<Avatar size="lg" class="  group-hover:bg-primary-700 group-hover:text-white ">
					<Icon icon={link?.icon || 'tabler:external-link'} size="40px" />
				</Avatar>
			{/if}
		</div>
	</div>
	<!-- </Card> -->
</a>
