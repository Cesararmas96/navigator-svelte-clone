<script lang="ts">
	import BiggerPicture from 'bigger-picture'
	import Macy from 'macy'
	import { onMount } from 'svelte'
	import response from './data.json'
	import { paginate, DarkPaginationNav, PaginationNav } from 'svelte-paginate'
	import { MultiSelect } from 'flowbite-svelte'

	import 'bigger-picture/css'

	let items = response
	let currentPage = 1
	let pageSize = 12
	$: paginatedItems = paginate({ items, pageSize, currentPage })
	let bp
	let imageLinks
	let content: any[] = []
	let contentMain: any[] = []
	let paginateData: Record<string, any> = {
		data: [],
		startIndex: 0,
		endIndex: 12
	}
	let total = 0
	let currentx = 1
	// let pageSize = 12
	// const baseUrl = `${import.meta.env.VITE_API_URL}/api/v2/`
	const baseUrl = 'https://api.trocdigital.io/api/v2/'
	let selected = []
	let countries = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' },
		{ value: 'jp', name: 'Japan' },
		{ value: 'en', name: 'England' }
	]

	function createGallery() {
		bp = BiggerPicture({
			target: document.body
		})

		const imageLinks = document.querySelectorAll('#images > a')

		for (let link of imageLinks) {
			link.addEventListener('click', openGallery)
		}

		function openGallery(e) {
			e.preventDefault()
			bp.open({
				items: imageLinks,
				el: e.currentTarget
			})
		}

		Macy({
			container: '#images',
			trueOrder: true,
			margin: 4,
			columns: 3,
			breakAt: {
				520: {
					columns: 2
				}
			}
		})
	}

	function paginatee() {
		const startIndex = (currentx - 1) * pageSize
		console.log(startIndex)
		const endIndex = Math.min(startIndex + pageSize, total)
		console.log(endIndex)

		const data = content.slice(startIndex, endIndex)
		console.log(data)

		const dataSrc = data.map((item) => {
			return {
				...item,
				src: item.photo_path
					? item.photo_path
					: `${baseUrl}services/images/${item.program}/${item.photo}?sec=${
							item.security ? item.security : '0'
					  }&dir=${item.directory}`,
				thumbnail: item.thumbnail_directory
					? `${baseUrl}services/images/${item.program}/${item.thumbnail_photo}?sec=${
							item.security ? item.security : '0'
					  }&dir=${item.thumbnail_directory}`
					: null
			}
		})

		paginateData = {
			data: dataSrc,
			startIndex,
			endIndex
		}

		console.log(paginateData)
		setTimeout(() => {
			createGallery()
		}, 200)
	}

	onMount(() => {
		total = response.length
		contentMain = response
		content = response

		setTimeout(() => {
			createGallery()
		}, 200)
		// paginatee()
	})

	function photo(item) {
		return `${baseUrl}services/images/${item.program}/${item.photo}?sec=${
			item.security ? item.security : '0'
		}&dir=${item.directory}`
	}
</script>

<div class="m-4 flex flex-row">
	<div class="basis-1/4">
		<MultiSelect items={countries} bind:value={selected} dropdownClass="z-50" />
	</div>
	<div class="basis-1/4" />
	<div class="basis-1/2" />
</div>

<DarkPaginationNav
	totalItems={items.length}
	{pageSize}
	{currentPage}
	limit={1}
	showStepOptions={true}
	on:setPage={(e) => (currentPage = e.detail.page)}
/>

<div id="images" class="grid-cols-2 gap-2">
	{#each paginatedItems as item}
		<a
			href={photo(item)}
			data-img={photo(item)}
			data-thumb={photo(item)}
			data-height="2000"
			data-width="1667"
			data-alt="Loading"
		>
			<img src={photo(item)} loading="lazy" alt="Loading" class="w-auto" />
			<div>
				<p>
					{item?.created_date}
				</p>
				<p>{item?.store_name}</p>
			</div>
		</a>
	{/each}
</div>

<DarkPaginationNav
	totalItems={items.length}
	{pageSize}
	{currentPage}
	limit={1}
	showStepOptions={true}
	on:setPage={(e) => (currentPage = e.detail.page)}
/>

<!-- <div class="photo-feed-pagination">
	<PaginationNav
		totalItems={items.length}
		{pageSize}
		{currentPage}
		limit={1}
		showStepOptions={true}
		on:setPage={(e) => (currentPage = e.detail.page)}
	/>
</div> -->

<style>
	/* .photo-feed-pagination :global(.pagination-nav) {
		background: red;
	} */
</style>
