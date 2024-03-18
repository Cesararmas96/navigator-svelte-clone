<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { actionReorder } from '$lib/helpers/widget/timeline'
	import type { Writable } from 'svelte/store'
	import Icon from '$lib/components/common/Icon.svelte'
	import { Textarea } from 'flowbite-svelte'

	export let data: any

	const originalRoute = [...data]

	let reason = ''

	$: if (data) init()

	const widget: Writable<any> = getContext('widget')
	const dashboard: Writable<any> = getContext('dashboard')
	const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

	const itemDef = $widget.format_definition

	// let images: any[] = []
	const baseUrl = import.meta.env.VITE_API_URL

	interface Event {
		title?: string
		date: string
		description: string
		icon?: string
	}

	// {
	// 	title: 'reward',
	// 	description: 'display_name',
	// 	icon: 'reward_group',
	// 	date: 'awarded_at'
	// }

	function orderByDate(events: any[]): Event[] {
		const parsedEvents = events.map((event) => {
			return {
				title: undefined,
				description: event,
				icon: undefined,
				date: new Date()
			}
		})

		parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

		return parsedEvents.map((event) => ({
			...event,
			date: event.date.toDateString()
		}))
	}

	// const loadImages = async () => {
	// 	const response = await getApiData(
	// 		`${baseUrl}/services/files/static/images/badges/`,
	// 		'GET'
	// 	).catch((error) => {
	// 		sendErrorNotification(error)
	// 	})
	// 	if (response) images = response
	// }

	// const getImage = (event) => {
	// 	const item = images.find((item: any) => {
	// 		if (typeof item === 'string') return false
	// 		const image = item?.filename.split('.png' || '.jpg')
	// 		if (image[0] === event.title) return item
	// 	})
	// 	return `${import.meta.env.VITE_API_URL}/static/images/badges/${item?.filename}`
	// }

	let orderedData: any[] = []
	const init = () => {
		// loadImages().then(() => {
		orderedData = orderByDate(data)
		// })
	}

	onMount(() => {
		init()
	})

	let draggedIndex = -1
	let targetIndex = -1

	function dragStart(event, index) {
		draggedIndex = index
	}

	function dragOver(event, index) {
		event.preventDefault()
		targetIndex = index
	}

	function drop(event) {
		event.preventDefault()
		if (targetIndex < 0 || draggedIndex < 0) return
		const itemToMove = data.splice(draggedIndex, 1)[0]
		data.splice(targetIndex, 0, itemToMove)
		init()
		draggedIndex = -1
		targetIndex = -1
		$widget.params?.reorder?.callback &&
			actionReorder[$widget.params?.reorder?.callback](dashboard, data)
		isSameRoute()
	}

	function reorderRoutes(index, direction) {
		if (direction === 'up' && index > 0) {
			;[data[index], data[index - 1]] = [data[index - 1], data[index]]
		} else if (direction === 'down' && index < data.length - 1) {
			;[data[index], data[index + 1]] = [data[index + 1], data[index]]
		}
		init()
		$widget.params?.reorder?.callback &&
			actionReorder[$widget.params?.reorder?.callback](dashboard, data)
		isSameRoute()
	}

	let sameRoutes = true
	const isSameRoute = () => {
		if (originalRoute.length !== data.length) {
			sameRoutes = false
			return
		}

		for (let i = 0; i < originalRoute.length; i++) {
			if (originalRoute[i] !== data[i]) {
				sameRoutes = false
				return
			}
		}

		sameRoutes = true
	}

	const resetRoute = () => {
		data = [...originalRoute]
		init()
		$widget.params?.reorder?.callback &&
			actionReorder[$widget.params?.reorder?.callback](dashboard, data)
		isSameRoute()
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="px-2 py-3">
	{#each orderedData as el, index}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="draggable mb-2 flex flex-row items-center justify-between rounded-lg p-2"
			on:dragstart={(event) => dragStart(event, index)}
			on:dragover={(event) => dragOver(event, index)}
			on:drop={drop}
			draggable={$widget.params?.reorder?.allowed}
			class:cursor-move={$widget.params?.reorder?.allowed}
		>
			<div class="flex flex-row items-center gap-2">
				<span
					class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary dark:text-black"
				>
					{abc[index]}
				</span>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">
					{@html el.description}
				</p>
			</div>
			<div class="flex flex-row gap-1 md:hidden">
				<Icon
					icon="tabler:arrow-down"
					size="16"
					classes={`btn btn-form h-8 py-0 px-2 ${index === orderedData.length - 1 ? 'hidden' : ''}`}
					on:click={() => reorderRoutes(index, 'down')}
				/>
				<Icon
					icon="tabler:arrow-up"
					size="16"
					classes={`btn btn-form h-8 py-0 px-2 ${index === 0 ? 'hidden' : ''}`}
					on:click={() => reorderRoutes(index, 'up')}
				/>
			</div>
			<div class="hidden md:flex"><Icon icon="tabler:menu-order" size="16" /></div>
		</div>
	{/each}
	{#if !sameRoutes}
		<div class="flex justify-end p-2">
			<button class="btn btn-form" on:click={resetRoute}>Reset to Optimal Route</button>
		</div>
		<div class="flex flex-col p-2">
			<label for="reason" class="mt-2">Reason for altering the Optimal Route (mandatory):</label>
			<Textarea
				id="reason"
				name="textarea"
				rows="5"
				bind:value={reason}
				class="form-control w-full rounded bg-white/75 p-2 text-base placeholder:text-muted dark:bg-dark-100/50"
				placeholder="Explain the reason why you will take a different route from the optimal one. Changing it can increase the overall mileage and lead to additional costs"
			/>
		</div>
	{/if}
	<div class="flex justify-end p-2">
		<button
			class="btn btn-form disabled:cursor-not-allowed disabled:opacity-50"
			disabled={!sameRoutes && reason === ''}>Submit Route</button
		>
	</div>
</div>

<style>
	.draggable {
		transition: transform 0.3s ease-in-out;
	}
</style>
