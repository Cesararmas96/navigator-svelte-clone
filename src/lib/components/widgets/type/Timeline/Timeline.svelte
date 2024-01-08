<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte'
	import jsonData from '../../../../../data/widgetTimelineData.json'
	import { iconColor } from '$lib/helpers/common/common'
	import { themeColor } from '$lib/stores/preferences'
	import { getApiData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'

	export let data: any

	let badges: any[] = []
	const baseUrl = import.meta.env.VITE_API_URL

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
			description: event.display_name || event.reward_group || event.message,
			icon: event.reward_group,
			date: new Date(event.awarded_at)
		}))

		parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

		return parsedEvents.map((event) => ({
			...event,
			date: event.date.toDateString()
		}))
	}

	const loadImages = async () => {
		const response = await getApiData(
			`${baseUrl}/services/files/static/images/badges/`,
			'GET'
		).catch((error) => {
			sendErrorNotification(error)
		})
		if (response) badges = response
	}

	const getBadge = (reward) => {
		const item = badges.find((item: any) => {
			if (typeof item === 'string') return false
			const image = item?.filename.split('.png' || '.jpg')
			if (image[0] === reward.title) return item
		})
		return `${import.meta.env.VITE_API_URL}/static/images/badges/${item?.filename}`
	}

	let orderedData: any[] = []
	loadImages().then(() => {
		orderedData = orderByDate(data)
	})
</script>

<Timeline order="vertical" class="mx-5 my-3">
	{#each orderedData as el}
		<TimelineItem title={el.title} date={el.date}>
			<svelte:fragment slot="icon">
				<span
					class={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary`}
				>
					<img src={getBadge(el)} alt="Navigator" />
				</span>
			</svelte:fragment>
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{el.description}</p>
		</TimelineItem>
	{/each}
</Timeline>
