<script lang="ts">
	import BiggerPicture from 'bigger-picture'
	import Macy from 'macy'
	import { paginate, DarkPaginationNav, PaginationNav } from 'svelte-paginate'
	import { MultiSelect } from 'flowbite-svelte'
	import { getContext, onMount } from 'svelte'

	import 'bigger-picture/css'

	export let data: any
	let items = data
	let currentPage = 1
	let pageSize = 12
	$: paginatedItems = paginate({ items, pageSize, currentPage })

	let bp
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
	let options = {
		root: null,
		rootMargin: '0px',
		threshold: 0
	}

	function createGallery() {
		bp = BiggerPicture({
			target: document.body
		})

		const imageLinks = document.querySelectorAll('#images > a')

		console.log('imageLinks', imageLinks)

		for (let link of imageLinks) {
			link.addEventListener('click', openGallery)
		}

		function openGallery(e) {
			console.log(e.currentTarget)
			console.log(imageLinks)
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

	const lazyLoad = (image, src) => {
		const loaded = () => {
			//image.classList.add('visible')                          // doesn't work in REPL
			image.style.opacity = '1' // REPL hack to apply loading animation
		}
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				image.src = src // replace placeholder src with the image src on observe
				if (image.complete) {
					// check if instantly loaded
					loaded()
				} else {
					image.addEventListener('load', loaded) // if the image isn't loaded yet, add an event listener
				}
			}
		}, options)
		observer.observe(image) // intersection observer

		return {
			destroy() {
				image.removeEventListener('load', loaded) // clean up the event listener
			}
		}
	}

	onMount(() => {
		setTimeout(() => {
			createGallery()
		}, 200)
	})

	async function photo(item) {
		return `${baseUrl}services/images/${item.program}/${item.photo}?sec=${
			item.security ? item.security : '0'
		}&dir=${item.directory}`
	}
</script>

<!-- <div class="m-4 flex flex-row">
	<div class="basis-1/4">
		<MultiSelect
		items={countries}
		bind:value={selected}
		dropdownClass="z-50 bg-white dark:bg-gray-900"
	/>	</div>
	<div class="basis-1/4" />
	<div class="basis-1/2" />
</div> -->

<DarkPaginationNav
	totalItems={items.length}
	{pageSize}
	{currentPage}
	limit={1}
	showStepOptions={true}
	on:setPage={(e) => {
		currentPage = e.detail.page
		setTimeout(() => {
			createGallery()
		}, 200)
	}}
/>

<div id="images" class="grid-cols-2 gap-2">
	{#each paginatedItems as item}
		{#await photo(item)}
			loading...
		{:then photoUrl}
			<a
				href={photoUrl}
				data-img={photoUrl}
				data-thumb={photoUrl}
				data-height="2000"
				data-width="1667"
				data-alt="Loading"
			>
				<img use:lazyLoad={photoUrl} loading="lazy" alt="Loading" class="w-auto" />
				<div>
					<p>
						{item?.created_date}
					</p>
					<p>{item?.store_name}</p>
				</div>
			</a>
		{/await}
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
