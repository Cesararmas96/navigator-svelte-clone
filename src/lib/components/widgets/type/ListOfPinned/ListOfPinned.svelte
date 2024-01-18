<script lang="ts">
	import { Card } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { getWidgetCategory } from '$lib/helpers/widgets/actions'
	import { getApiData } from '$lib/services/getData'
	import { icons } from '$lib/helpers/common/icons'

	export let data: any
	let view: boolean = true

	const urlBase = import.meta.env.VITE_API_URL
	// const pinEndpoint = `${urlBase}/api/v1/interactions/pin`
	const likeEndpoint = `${urlBase}/api/v1/interactions/likes`

	// const handlePinWidget = (widget) => {
	// 	try {
	// 		if (widget.pin) {
	// 			getApiData(pinEndpoint, 'DELETE', { widget_id: widget.widget_id })
	// 			console.log('unpin')
	// 		} else if (!widget.pin) {
	// 			getApiData(pinEndpoint, 'PUT', { widget_id: widget.widget_id, user_id: widget.user_id })
	// 			console.log('pin')
	// 		}
	// 	} catch (e) {
	// 		console.log(e)
	// 	}

	// 	return (widget.pin = !widget.pin)
	// }

	const handleLikeWidget = (widget) => {
		try {
			if (widget.like) {
				getApiData(likeEndpoint, 'PUT', { object_uuid: widget.widget_id, object_type: 'widget' })
				widget.like = false
			} else {
				getApiData(likeEndpoint, 'DELETE', { object_uuid: widget.widget_id, object_type: 'widget' })
				widget.like = true
			}
		} catch (error) {
			console.log(error)
		}

		return widget.like
	}

	const handleShareWidget = (widget) => {
		const url = `/share/widget/${widget?.widget_id}`
		const link = document.createElement('a')
		link.href = url
		link.target = '_blank'
		link.click()
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

<div class="flex">
	{#if view}
		<div class="mx-6 w-full flex-row gap-2">
			<!-- <div class="grid grid-cols-6 gap-5"> -->
			<div
				class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8"
			>
				{#each data as widget}
					<Card padding="none" class="group">
						<button
							class="p-1 text-start text-primary-700"
							on:click={() => handleShareWidget(widget)}
						>
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
							</div>
						</button>

						<div
							class=" flex flex-auto cursor-pointer items-end justify-between p-2 text-sm text-muted group-hover:text-link"
						>
							<button on:click={() => (widget.like = handleLikeWidget(widget))}>
								<Icon
									icon={widget.like ? 'twemoji:red-heart' : 'icon-park-outline:like'}
									size={'16px'}
								/>
							</button>
							<!-- <button on:click={() => handlePinWidget(widget)}>
					<Icon icon={widget.pin ? 'tabler:pinned-off' : 'tabler:pinned'} size={'16px'} />
				</button> -->

							<button class="ml-auto" on:click={() => handleShareWidget(widget)}>
								<Icon icon={'mdi:share-variant'} size={'16px'} />
							</button>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mx-6 w-full flex-row gap-2">
			{#each data as widget}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="mb-1 flex cursor-pointer items-center rounded-md border border-light-200 bg-primary-50 p-2 px-4 py-3 hover:bg-primary-100 dark:border-dark-200 dark:bg-dark-200 dark:hover:bg-dark-300"
					on:click={() => handleShareWidget(widget)}
				>
					<div class="mr-3 flex-shrink-0">
						<img src={icons[widget?.attributes?.icon]} alt="" width="20 " />
					</div>
					<div class="flex-1">
						<div class="font-bold text-heading hover:underline">{widget.title}</div>
						<div class="text-md text-muted">{widget.description || widget.widget_name || ''}</div>
					</div>
					<div class="icon btn z-50 mx-8 gap-4">
						<button
							on:click={(event) => {
								event.preventDefault()
								event.stopPropagation()
								widget.like = handleLikeWidget(widget)
							}}
						>
							<Icon
								icon={widget.like ? 'twemoji:red-heart' : 'icon-park-outline:like'}
								size={'16px'}
							/>
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
