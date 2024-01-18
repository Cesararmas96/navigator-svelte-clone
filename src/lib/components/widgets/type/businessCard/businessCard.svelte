<script lang="ts">
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { Avatar } from 'flowbite-svelte'

	export let data: any

	const widget = getContext<Writable<any>>('widget')

	let information = {}
	let colors: string[] = ['blue', 'green', 'orange', 'yellow']
	let avatar: null
	let title: null
	let subTitle: null
	let personalInfo: any[] = []

	console.log(data, $widget)
	information = data[0]

	avatar =
		$widget.params.information && $widget.params.information.avatar
			? information[$widget.params.information.avatar]
			: // : information && information.display_name
			  // ? information.display_name
			  `${information.first_name.charAt(0)} ${information.last_name.charAt(0)}`

	title =
		$widget.params.information && $widget.params.information.title
			? information[$widget.params.information.title]
			: information && information.display_name
			? information.display_name
			: `${information.first_name} ${information.last_name}`

	subTitle =
		$widget.params.information && $widget.params.information.subTitle
			? information[$widget.params.information.subTitle]
			: information.job_title_description

	personalInfo =
		$widget.params.information && $widget.params.information.personalInfo
			? $widget.params.information.personalInfo
			: ['store_name', 'warp_id']
</script>

<div class="col-12 block p-2">
	<div class=" profile-card-with-cover">
		<div class="flex w-full flex-row justify-center">
			<Avatar
				size="lg"
				class={`user-avatar bold text-5xl font-bold tracking-tighter text-white bg-${
					colors[Math.floor(Math.random() * 4)]
				}-600`}>{avatar}</Avatar
			>
		</div>
		<div class="profile-card-with-cover-content text-center">
			<div class="card-body pt-0">
				{#if title}
					<h4 class="text-lg">
						{title}
					</h4>
				{/if}
				{#if subTitle}
					<h6 class="text-md">
						{subTitle}
					</h6>
				{/if}
				{#if personalInfo}
					{#each personalInfo as info}
						<ul class="list-inline">
							{#if information[info]}
								<li>
									{information[info]}
								</li>
							{/if}
						</ul>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
