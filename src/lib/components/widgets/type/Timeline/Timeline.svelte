<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte'
	import { getApiData } from '$lib/services/getData'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import Icon from '$lib/components/common/Icon.svelte'

	export let data: any

	const widget: Writable<any> = getContext('widget')

	const itemDef = $widget.format_definition

	let images: any[] = []
	const baseUrl = import.meta.env.VITE_API_URL

	interface Event {
		title: string
		date: string
		description: string
		icon: string
	}

	// {
	// 	title: 'reward',
	// 	description: 'display_name',
	// 	icon: 'reward_group',
	// 	date: 'awarded_at'
	// }

	function orderByDate(events: any[]): Event[] {
		const parsedEvents = events.map((event) => {
			return typeof event === 'string'
				? {
						title: undefined,
						description: event,
						icon: undefined,
						date: new Date()
				  }
				: {
						title: event[itemDef.title],
						description: event[itemDef.description],
						icon: event[itemDef.icon],
						date: new Date(event[itemDef.date])
				  }
		})

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
		if (response) images = response
	}

	const getImage = (event) => {
		const item = images.find((item: any) => {
			if (typeof item === 'string') return false
			const image = item?.filename.split('.png' || '.jpg')
			if (image[0] === event.title) return item
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
		<TimelineItem title={el.title} date={el.title ? el.date : undefined}>
			<svelte:fragment slot="icon">
				<span
					class={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary`}
				>
					{#if Object.keys(itemDef).length === 0}
						<Icon icon={$widget.params?.items_icon || 'material-symbols:timer-outline-rounded'} />
					{:else}
						<img src={getImage(el)} alt="Navigator" />
					{/if}
				</span>
			</svelte:fragment>
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
				{@html el.description}
			</p>
		</TimelineItem>
	{/each}
</Timeline>
