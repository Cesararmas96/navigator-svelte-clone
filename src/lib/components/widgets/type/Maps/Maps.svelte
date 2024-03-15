<script lang="ts">
	import { addWidgetAction } from '$lib/helpers'
	import { actionsMapsPostRender } from '$lib/helpers/widget/map'
	import { contentHeight, setContentHeight } from '$lib/helpers/widget/widget'
	import { getContext, onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let data: any = null

	let locations = []

	$: if (data?.locations && document.getElementById(`map-${$widget.widget_id}`)) {
		locations = data.locations
		calculateAndDisplayRoute(directionsService, directionsRenderer)
	}

	const widget: any = getContext('widget')
	const dashboard: Writable<any> = getContext('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')

	let map
	let directionsService
	let directionsRenderer
	let mapElement // Este es el elemento del DOM donde se montará el mapa

	onMount(() => {
		if (window.google && google.maps) {
			initMap()
		} else {
			window.initMap = initMap
		}
	})

	function initMap() {
		directionsService = new google.maps.DirectionsService()
		directionsRenderer = new google.maps.DirectionsRenderer()

		const mapOptions = {
			zoom: 10,
			center: locations[0] // Centrar el mapa en la primera ubicación
		}

		map = new google.maps.Map(mapElement, mapOptions)
		directionsRenderer.setMap(map)

		calculateAndDisplayRoute(directionsService, directionsRenderer)
	}

	function calculateAndDisplayRoute(directionsService, directionsRenderer) {
		const waypoints = locations.slice(1, -1).map((location: { lat: number; lng: number }) => ({
			location: new google.maps.LatLng(location.lat, location.lng),
			stopover: true
		}))

		directionsService.route(
			{
				origin: locations[0],
				destination: locations[locations.length - 1],
				waypoints: waypoints,
				travelMode: google.maps.TravelMode.DRIVING
			},
			(response, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsRenderer.setDirections(response)
					$widget.params?.postRenderCalculate &&
						actionsMapsPostRender[$widget.params?.postRenderCalculate](dashboard, response)
				} else {
					window.alert('Directions request failed due to ' + status)
				}
			}
		)
	}

	const resizeMapToContent = () => {
		const iFrame: HTMLElement = document.getElementById(`map-${$widget.widget_id}`)!
		// if (!iFrame) return
		iFrame.style['min-height'] = contentHeight($widget.widget_id)
		iFrame.style['height'] = iFrame.style['min-height']
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
</script>

<svelte:head>
	<script
		async
		defer
		src="https://maps.googleapis.com/maps/api/js?key={import.meta.env
			.VITE_GOOGLE_MAPS_KEY}&callback=initMap"
		type="text/javascript"
	></script>
</svelte:head>

<div id={`map-${$widget.widget_id}`} bind:this={mapElement} style="width: 100%; height: 400px;" />
