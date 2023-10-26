<script lang="ts">
	import { Button, Card } from 'flowbite-svelte'
	import jsonData from '../../../../../data/widgetLinkData.json'

	const getWidgetCardData = (jsonData: any) => {
		const data = jsonData
		console.log(data)
		return data
	}

	const data = getWidgetCardData(jsonData)

	let isHovered: boolean

	function handleMouseEnter() {
		isHovered = true
	}

	function handleMouseLeave() {
		isHovered = false
	}

	console.log(data)
</script>

<div
	class="card-container"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
>
	<Card href={data.href}>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{data.title}
		</h5>
		<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
			{data.description}
		</p>
	</Card>
</div>

<style>
	.card-container {
		position: relative;
		transition: transform 0.3s ease-in-out;
	}

	.card-container:hover {
		transform: translateY(-10px); /* Adjust the value as needed */
	}
</style>
