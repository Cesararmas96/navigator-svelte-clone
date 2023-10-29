<script lang="ts">
	import { Avatar } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import type { Link } from './interface'
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')
	let link: Link = $widget.format_definition

	$: {
		setTimeout(() => {
			link = $widget.format_definition
		}, 5)
	}
</script>

<a href={link?.href} target={link?.external ? '_blank' : ''}>
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
				<Avatar size="lg">
					<Icon icon={link?.icon || 'tabler:external-link'} size="40px" />
				</Avatar>
			{/if}
		</div>
	</div>
	<!-- </Card> -->
</a>
