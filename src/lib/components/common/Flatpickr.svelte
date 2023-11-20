<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte'
	import flatpickr from 'flatpickr'
	import { merge } from 'lodash-es'
	import 'flatpickr/dist/flatpickr.css'
	import moment from 'moment'

	let flatpickrElement: HTMLElement
	export let pickr: any = null

	export let value: string = ''
	// export let time: boolean = false
	// export let format: string = 'Y-m-d H:i'
	// export let altFormat: string = 'F j, Y'
	// export let minDate: string = value || 'today'
	export let config: Record<string, any> = {}

	// function setMinDate($minDate: string) {
	// 	if (pickr) {
	// 		if ($minDate !== 'today') {
	// 			pickr.set('minDate', $minDate)
	// 		}
	// 	}
	// }

	// $: console.log(flatpickrElement, pickr)

	onMount(() => {
		console.log('config', config)
		pickr = flatpickr(
			flatpickrElement,
			merge(
				{},
				{
					// inline: true,
					// altInput: true,
					// altFormat: altFormat,
					// dateFormat: format,
					// minDate: minDate,
					// enableTime: time,
					defaultDate: value,

					onValueUpdate(_: any, dateStr: string) {
						if (!dateStr) {
							value = ''
						}
					}
				},
				config,
				{
					onChange(selectedDates: any, dateStr: any, instance: any) {
						if (config?.onChange) {
							config.onChange(selectedDates, dateStr, instance)

							const dates = instance.selectedDates

							if (dates[1]) {
								value = `${moment(dates[0]).format('YYYY-MM-DD')} - ${moment(dates[1]).format(
									'YYYY-MM-DD'
								)}`
							} else {
								value = `${moment(dates[0]).format('YYYY-MM-DD')}`
							}
						} else {
							value = dateStr
						}
					}
				}
			)
		)
	})
</script>

<input {...$$restProps} bind:this={flatpickrElement} class="hidden" />
