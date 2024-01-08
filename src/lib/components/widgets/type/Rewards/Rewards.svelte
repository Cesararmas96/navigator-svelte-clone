<script lang="ts">
	import { getContext } from 'svelte'
	import Reward from './Reward.svelte'
	import type { Writable } from 'svelte/store'
	import { getApiData } from '$lib/services/getData'
	import _ from 'lodash'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { addInstance, clearInstances } from '$lib/helpers/widget/instances'

	export let data: any

	/** comentario para dev */

	const widget = getContext<Writable<any>>('widget')

	const baseUrl = import.meta.env.VITE_API_URL

	let rewards: any[] = []
	let badges: any[] = []

	const getData = async () => {
		await loadImages()

		if (data) {
			if ($widget?.params?.groupBy) {
				const groupedData = _.groupBy(data, $widget?.params?.groupBy)
				const sortable: any[] = []
				Object.keys(groupedData).map((item) => {
					sortable.push({ label: item, value: groupedData[item] })
				})
				console.log(sortable)

				const sortedData = _.sortBy(sortable, [(value) => value?.label.toLowerCase()])

				rewards = sortedData
			} else {
				rewards = data
			}
			rewards.map((group) => {
				group.value = _.sortBy(group.value, (value) => [-1 * value?.rewards, value?.reward])
			})
		}
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
		return badges.find((item: any) => {
			if (typeof item === 'string') return false
			const image = item?.filename.split('.png' || '.jpg')
			if (image[0] === reward.reward) return item
		})
	}

	const addWidgetTemp = (reward) => {
		if (reward?.rewards === 0) return false

		clearInstances(widget)
		const drilldowns: any[] =
			$widget.params.drilldowns && Array.isArray($widget.params.drilldowns)
				? $widget.params.drilldowns
				: [
						{
							params: {
								query: {
									slug: 'navigator_reward_details_by_user'
								},
								toolbar_items: ['export_raw', 'filter']
							},
							classbase: 'pqTableWidget',
							attributes: {
								icon: 'fa fa-table'
							},
							conditions: {},
							format_definition: {
								award_id: {
									order: 1,
									align: 'left',
									title: 'Award ID',
									format: '####'
								},
								reward_id: {
									order: 2,
									align: 'left',
									title: 'Reward ID',
									format: '####'
								},
								reward: {
									order: 3,
									title: 'Reward'
								},
								description: {
									minWidth: 350,
									maxWidth: 500,

									title: 'Description'
								},
								reward_group: {
									title: 'Group'
								},
								giver_email: {
									title: 'Giver'
								},
								giver_message: {
									title: 'Message'
								},
								awarded_at: {
									title: 'Awarded At',
									render: 'dateAndTime',
									align: 'center'
								},
								icon: {
									hidden: true
								},
								giver_user: {
									hidden: true
								},
								receiver_user: {
									hidden: true
								},
								receiver_email: {
									hidden: true
								}
							}
						}
				  ]
		drilldowns.forEach((drilldown: any) => {
			const drilldownConfig = Object.assign(
				{},
				{
					master_filtering: true,
					conditions:
						!drilldown!.extendConditions || drilldown!.extendConditions === 'false'
							? {}
							: $widget.conditions,
					dashboard_id: $widget.dashboard_id,
					module_id: $widget.module_id,
					program_id: $widget.program_id,
					widget_type_id: $widget.widget_type_id,
					parent: $widget.widget_id,
					dataExtra: drilldown!.dataExtra, // TODO: investigar que es el dataExtra
					title: $widget?.params?.title || 'Reward Details',
					extendConditions: true,
					removeFields: false
				},
				drilldown,
				{
					params: {
						...drilldown.params,
						settings: $widget.params.settings
					}
				}
			)
			addInstance(widget, drilldownConfig)
		})
	}

	getData()
</script>

{#if $widget.params && $widget.params.groupBy}
	<div class="inline-grid text-left font-bold">
		{#each rewards as categories}
			<span class="px-10 text-xl">
				{categories.label}
			</span>
			<div class="ttext-sm grid grid-cols-2 gap-4 p-2 text-center font-bold lg:grid-cols-4">
				{#each categories.value as reward}
					<div class="p-8" class:greyout={reward.rewards === 0}>
						<Reward {reward} badge={getBadge(reward)} on:click={() => addWidgetTemp(reward)} />
					</div>
				{/each}
			</div>
		{/each}
	</div>
{:else}
	<div class="grid grid-cols-2 gap-4 p-4 text-center text-sm font-bold lg:grid-cols-4">
		{#each rewards as reward}
			<div class="p-8" class:greyout={reward.rewards === 0}>
				<Reward {reward} badge={getBadge(reward)} on:click={() => addWidgetTemp(reward)} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.greyout {
		-webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
		filter: grayscale(100%);
	}
</style>
