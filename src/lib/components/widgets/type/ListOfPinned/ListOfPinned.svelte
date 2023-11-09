<script lang="ts">
	import { Card } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getWidgetCategory } from '$lib/helpers/widgets/actions'
	import { getApiData } from '$lib/services/getData'

	export let data: any
	let view: boolean = true

	const urlBase = import.meta.env.VITE_API_URL
	const pinEndpoint = `${urlBase}/api/v1/interactions/pin`
	const likeEndpoint = `${urlBase}/api/v1/interactions/likes`

	const handlePinWidget = (widget) => {
		try {
			if (widget.pin) {
				getApiData(pinEndpoint, 'DELETE', { widget_id: widget.widget_id })
				console.log('unpin')
			} else if (!widget.pin) {
				getApiData(pinEndpoint, 'PUT', { widget_id: widget.widget_id, user_id: widget.user_id })
				console.log('pin')
			}
		} catch (e: any) {
			console.log(e.text)
		}

		return (widget.pin = !widget.pin)
	}

	const handleLikeWidget = (widget) => {
		try {
			if (widget.like) {
				getApiData(likeEndpoint, 'PUT', { object_uuid: widget.widget_id, object_type: 'widget' })
				console.log('like')
				widget.like = false
			} else {
				getApiData(likeEndpoint, 'DELETE', { object_uuid: widget.widget_id, object_type: 'widget' })
				console.log('remove like')
				widget.like = true
			}
		} catch (error) {
			console.log(error)
			// Handle error, revert state changes or retry the API call
		}

		return widget
	}

	const handleShareEntireWidget = () => {
		// const url = `/share/dashboard/${dashboard.program_id}/${dashboard.module_id}/${dashboard.dashboard_id}`;
		const link = document.createElement('a')
		// link.href = url;
		link.setAttribute('target', '_blank')
		link.click()
		// dropdownOpen = false;
	}

	const handleShareWidget = (widget) => {
		const url = `/share/widget/${widget?.dashboard_id}/${widget?.widget_id}`
		const link = document.createElement('a')
		link.href = url
		link.target = '_blank'
		link.click()
	}

	const icons = {
		'fa fa-bar-chart': `/img/icons/bar.png`,
		'fa fa-area-chart': `/img/icons/area.png`,
		'fa fa-table': `/img/icons/grid.png`,
		'fa fa-circle-o-notch': `/img/icons/pie-2.png`,
		'fa fa-tachometer': `/img/icons/speedometer.png`,
		'fa fa-id-card-o': `/img/icons/id.png`,
		'fa fa-map': `/img/icons/map.png`,
		'fa fa-clock-o': `/img/icons/clock.png`,
		'far fa-rss': `/img/icons/rss.png`,
		'fa fa-desktop': `/img/icons/pc.png`,
		'material-symbols:iframe': `/img/icons/pc.png`,
		'fa fa-file-image-o': `/img/icons/photo.png`,
		'fa fa-film': `/img/icons/cinema.png`,
		'fa fa-youtube': `/img/icons/youtube.png`,
		'tabler:brand-spotify': `/img/icons/spotify.svg`,
		'tabler:carousel-horizontal': `/img/icons/gallery.png`,
		'tabler:wash-dry-shade': `/img/icons/content.png`,
		undefined: `/img/icons/loading.svg`,
		loading: `/img/icons/loading.svg`,
		'fa fa-flickr': `/img/icons/flickr.svg`
	}
</script>

<div
	class="m-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
>
	<button
		class="flex h-10 flex-1 items-center justify-center bg-gray-100 hover:bg-gray-300 dark:text-black dark:hover:bg-gray-800"
		class:bg-primary-600={view}
		class:text-white={view}
		on:click={() => (view = !view)}
	>
		<Icon icon={'tabler:layout-grid'} size="14px" classes="mx-1" />
		Card View
	</button>
	<button
		class="flex h-10 flex-1 items-center justify-center bg-gray-100 hover:bg-gray-300 dark:text-black dark:hover:bg-gray-800"
		class:bg-primary-600={!view}
		class:text-white={!view}
		on:click={() => (view = !view)}
	>
		<Icon icon={'tabler:layout-list'} size="14px" classes="mx-1" /> Table View
	</button>
</div>
<!-- <Tabs style="underline"> -->
<div class="flex">
	{#if view}
		<div class="mx-6 w-full flex-row gap-2">
			<!-- <div class="grid grid-cols-6 gap-5"> -->
			<div
				class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8"
			>
				{#each data as widget}
					<Card padding="none" class="group">
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="" class="p-1 text-primary-700">
							<div class="relative h-20">
								<i class="group block h-20 rounded bg-current opacity-30" />
								<span
									class="icon absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-current opacity-70 group-hover:opacity-100"
								>
									<img src={icons[widget?.attributes?.icon]} alt="" width="20 " />
								</span>
							</div>
							<div class="flex-1 overflow-hidden p-2">
								<div class="truncate text-lg group-hover:text-link">{widget.title}</div>
								<div class="text-sm text-muted group-hover:text-link">
									{widget.description || widget.widget_name || ''}
								</div>
								<div class="text-md text-muted group-hover:text-link">
									{getWidgetCategory(widget)}
								</div>
								<div class="items-end text-sm text-muted group-hover:text-link">
									<button on:click={() => handleLikeWidget(widget)}>
										<Icon
											icon={widget.like ? 'twemoji:red-heart' : 'icon-park-outline:like'}
											size={'16px'}
										/>
									</button>
									<button on:click={() => handlePinWidget(widget)}>
										<Icon icon={widget.pin ? 'tabler:pinned-off' : 'tabler:pinned'} size={'16px'} />
									</button>

									<button class="ml-auto" on:click={() => handleShareWidget(widget)}>
										<Icon icon={'mdi:share-variant'} size={'16px'} />
									</button>
								</div>
							</div>
						</a>
					</Card>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mx-6 w-full flex-row gap-2">
			{#each data as widget}
				<div
					class="mb-1 flex items-center rounded-md border border-light-200 bg-primary-50 p-2 px-4 py-3 hover:bg-primary-100 dark:border-dark-200 dark:bg-dark-200 dark:hover:bg-dark-300"
				>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="" class="mr-3 flex-shrink-0">
						<img src={icons[widget?.attributes?.icon]} alt="" width="20 " />
					</a>
					<div class="flex-1">
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="" class="font-bold text-heading hover:underline">{widget.title}</a>
						<div class="text-md text-muted">{widget.description || widget.widget_name || ''}</div>
					</div>
					<div class="icon btn mx-8 gap-2 hover:bg-light-100 dark:hover:bg-dark-200">
						<button on:click={() => handleLikeWidget(widget)}>
							<Icon
								icon={widget.like ? 'twemoji:red-heart' : 'icon-park-outline:like'}
								size={'16px'}
							/>
						</button>
						<button on:click={() => handlePinWidget(widget)}>
							<Icon icon={widget.pin ? 'tabler:pinned-off' : 'tabler:pinned'} size={'16px'} />
						</button>

						<button class="ml-auto" on:click={() => handleShareWidget(widget)}>
							<Icon icon={'mdi:share-variant'} size={'16px'} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
