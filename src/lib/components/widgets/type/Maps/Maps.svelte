<script lang="ts">
	import { addWidgetAction } from '$lib/helpers'
	import { actionsMapsPostRender } from '$lib/helpers/widget/map'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let data: any = null

	let locations: any[] = []
	let url
	let zoom
	let scale
	let markers

	$: if (data?.locations && document.getElementById(`map-${$widget.widget_id}`)) {
		locations = data.locations
		calculateAndDisplayRoute(directionsService, directionsRenderer)
	}

	const loadUrl = () => {
		locations = []
		url = new URL(data.url)
		zoom = url.searchParams.get('zoom')
		scale = url.searchParams.get('scale')
		markers = url.searchParams.getAll('markers')
		const locationsTemp = markers.map((item) => {
			const parts = item.split('|')
			const obj = {}

			parts.forEach((part) => {
				const [key, value] = part.split(':')

				if (!value && key.includes(',')) {
					const [lat, lng] = key.split(',').map(Number)
					obj['lat'] = lat
					obj['lng'] = lng
				} else {
					obj[key] = value
				}
			})

			return obj
		})

		locations.push(locationsTemp.find((l) => l.label === 'O'))
		locations.push(...locationsTemp.filter((l) => l.size))
		locations.push(locationsTemp.find((l) => l.label === 'D'))
	}

	let tempUrl
	$: if (
		data?.url &&
		data?.url !== tempUrl &&
		document.getElementById(`map-${$widget.widget_id}`)
	) {
		$widget.loading = true
		tempUrl = data?.url
		loadUrl()
		calculateAndDisplayRoute(directionsService, directionsRenderer)
		$widget.loading = false
	}

	const widget: any = getContext('widget')
	const dashboard: Writable<any> = getContext('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let map
	let directionsService
	let directionsRenderer
	let mapElement

	onMount(() => {
		if (window.google && google.maps) {
			initMap()
		} else {
			if (!window.initMap) {
				window.initMap = initMap
			}
		}
	})

	function initMap() {
		directionsService = new google.maps.DirectionsService()
		directionsRenderer = new google.maps.DirectionsRenderer()

		const mapOptions = {
			zoom: 10,
			center: locations[0],
			mapId: 'MAP_' + $widget.widget_id
		}

		map = new google.maps.Map(mapElement, mapOptions)
		directionsRenderer.setMap(map)

		if (data?.url) loadUrl()
		calculateAndDisplayRoute(directionsService, directionsRenderer)
	}

	function calculateAndDisplayRoute(directionsService, directionsRenderer) {
		const waypoints = locations
			.map((location: any) => {
				if (!location.size) return
				return {
					location: new google.maps.LatLng(location.lat, location.lng),
					stopover: false
				}
			})
			.filter((l) => l)
		const origin = locations.find((l) => l.label === 'O' && !l.size)
		const destination = locations.find((l) => l.label === 'D' && !l.size)
		directionsService.route(
			{
				origin: new google.maps.LatLng(origin.lat, origin.lng),
				destination: new google.maps.LatLng(destination.lat, destination.lng),
				waypoints: waypoints,
				optimizeWaypoints: true,
				travelMode: google.maps.TravelMode.DRIVING
			},
			(response, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsRenderer.setDirections(response)
					locations.forEach((location) => {
						if (location.label === 'D' && !location.size) return
						const pinElement = new google.maps.marker.PinElement({
							background:
								location.label === 'O' ? location.color : location.color.replace('0x', '#'),
							borderColor: 'white',
							glyph: location.label,
							scale: location.label === 'O' ? 1.1 : 0.9,
							glyphColor: 'white'
						})
						const marker = new google.maps.marker.AdvancedMarkerElement({
							position: new google.maps.LatLng(location.lat, location.lng),
							map: map,
							content: pinElement.element,
							title: location.label
						})
					})

					$widget.params?.postRenderCalculate &&
						actionsMapsPostRender[$widget.params?.postRenderCalculate](dashboard, response)
				} else {
					window.alert('Directions request failed due to ' + status)
				}
			}
		)
	}

	// let resized: boolean = false
	// $: if (
	// 	document.querySelector(`#map-${$widget.widget_id}`) &&
	// 	!$widget.param?.hidden &&
	// 	!resized
	// ) {
	// 	setTimeout(() => {
	// 		resizeMapToContent()
	// 		resized = true
	// 	}, 500)
	// }

	const resizeMapToContent = () => {
		const mapEL: HTMLElement | null = document.getElementById(`map-${$widget.widget_id}`)
		if (!mapEL) return

		// const toolsHeight = document.getElementById(`map-tools-${$widget.widget_id}`)?.offsetHeight || 0
		// console.log('toolsHeight', toolsHeight)
		mapEL.style['min-height'] = contentHeight($widget.widget_id) //- toolsHeight
		mapEL.style['height'] = mapEL.style['min-height']
		// $widget.resized = false
	}
	addWidgetAction(widgetActions, {
		name: 'resizeContent',
		action: () => {
			setContentHeight($widget.widget_id)
			resizeMapToContent()
		}
	})
	$: if (!$widget.params?.hidden) {
		setTimeout(() => {
			resizeMapToContent()
		}, 500)
	}

	const changeZoom = () => {
		url.searchParams.set('zoom', zoom)
		url = new URL(url.toString())
	}
	const changeScale = () => {
		url.searchParams.set('scale', scale)
		url = new URL(url.toString())
	}
</script>

<!-- <svelte:head >
		<script
			async
			defer
			src="https://maps.googleapis.com/maps/api/js?key={import.meta.env
				.VITE_GOOGLE_MAPS_KEY}&libraries=places,marker,drawing,geometry&loading=async&callback=initMap"
			type="text/javascript"
		></script>
</svelte:head> -->

<div id={`map-${$widget.widget_id}`} bind:this={mapElement} style="width: 100%; height: 400px;" />
