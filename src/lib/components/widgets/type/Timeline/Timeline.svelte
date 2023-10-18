<script lang="ts">
	import { Card, Timeline, TimelineItem } from 'flowbite-svelte'
	import jsonData from '../../../../../data/widgetTimelineData.json'
	import Icon from '$lib/components/common/Icon.svelte'

	interface Event {
		title: string
		date: string
		description: string
		icon: string
	}

	const getWidgetCardData = (jsonData: any) => {
		const data = jsonData
		console.log(data)
		return data
	}

	const data = getWidgetCardData(jsonData)

	function orderByDate(events: Event[]): Event[] {
		// 1. Parse each of the event and get its date
		const parsedEvents = events.map((event) => ({
			...event,
			date: new Date(event.date)
		}))

		// 2. Sort the array by date
		parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

		// 3. Convert date objects back to string format and returns it
		return parsedEvents.map((event) => ({
			...event,
			date: event.date.toDateString()
		}))
	}

	const orderedData = orderByDate(data)

	console.log(orderedData)
</script>

<Timeline order="vertical" class="mx-5 my-3">
	{#each orderedData as el}
		<TimelineItem title={el.title} date={el.date}>
			<svelte:fragment slot="icon">
				<span
					class="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-8 ring-white"
					style="color: white"
				>
					<Icon icon={'material-symbols:wifi-calling-1-rounded'} />
				</span>
			</svelte:fragment>
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{el.description}</p>
		</TimelineItem>
	{/each}
</Timeline>
