<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables'
	import { onMount } from 'svelte'

	export let data: any
	console.log(data)
	let columns: any[] = []

	data.forEach((element: any) => {
		let keys = Object.keys(element)
		keys.forEach((key) => {
			if (!columns.find((column) => column.title === key)) {
				columns.push({ title: key, field: key })
			}
		})
	})

	let tableComponent: any

	onMount(() => {
		new Tabulator(tableComponent, {
			data: data, //link data to table
			columns: columns,
			layout: 'fitDataFill', //fit columns to width of table (optional)
			// autoColumns: true,
			renderHorizontal: 'virtual',
			height: '500px',

			pagination: true,
			paginationSize: 10,
			paginationSizeSelector: [10, 20, 30, 40, 50],
			movableColumns: true,
			paginationCounter: 'rows'
		})
	})
</script>

<div id="table-tabulator" bind:this={tableComponent} />

<svelte:head>
	<link
		href="https://unpkg.com/tabulator-tables@4.9.1/dist/css/tabulator.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<style>
</style>
