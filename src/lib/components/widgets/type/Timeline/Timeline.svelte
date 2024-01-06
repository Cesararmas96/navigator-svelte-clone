<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte'
	import jsonData from '../../../../../data/widgetTimelineData.json'
	import { iconColor } from '$lib/helpers/common/common'
	import { themeColor } from '$lib/stores/preferences'

	export let data: any
	interface Event {
		title: string
		date: string
		description: string
		icon: string
	}

	function orderByDate(events: any[]): Event[] {
		const parsedEvents = events.map((event) => ({
			// ...event,
			title: event.reward,
			description: event.reward_group,
			icon: event.reward_group,
			date: new Date(event.awarded_at)
		}))

		parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

		return parsedEvents.map((event) => ({
			...event,
			date: event.date.toDateString()
		}))
	}

	const orderedData = orderByDate(data)
</script>

<Timeline order="vertical" class="mx-5 my-3">
	{#each orderedData as el}
		<TimelineItem title={el.title} date={el.date}>
			<svelte:fragment slot="icon">
				<span
					class={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary`}
				>
					<img src="/images/icons/timeline{iconColor($themeColor)}.svg" alt="Navigator" />
				</span>
			</svelte:fragment>
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{el.description}</p>
		</TimelineItem>
	{/each}
</Timeline>
