<script>
	import Icon from '$lib/components/common/Icon.svelte'

	let activeComments = false
	let activeLike = false
</script>

<div class="mb-4 p-5">
	<!-- <include src="./partials/user/timeline/_post-header.html"> { "time": "5 Minutes ago" }</include> -->
	<div class="mb-4 flex items-start">
		<a href="" class="mr-3">
			<img class="w-10 rounded-full" src="/images/troc.png" alt="" />
		</a>
		<div class="flex-1">
			<div class="font-bold text-heading">Malinda Hollaway</div>
			<div class="text-sm text-muted">5 Minutes ago</div>
		</div>
		<div class="relative" data-tb-dropdown>
			<button
				type="button"
				class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
				data-tb-dropdown-toggle
				aria-expanded="false"
			>
				<Icon icon="material-symbols:more-vert" size="16" />
			</button>
		</div>
	</div>

	<div class="mb-5">
		Maecenas faucibus mollis interdum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
		venenatis vestibulum. Cras mattis consectetur purus sit amet fermentum. Lorem ipsum dolor sit
		amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor
		ligula, eget lacinia odio sem nec elit.
	</div>

	<!-- <include src="./partials/user/timeline/_comment-numbers.html"> { "likes": "24", "comments": "12" }</include> -->
	<div
		class="mb-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
	>
		<button
			class="flex h-10 flex-1 items-center justify-center hover:bg-light-100 dark:hover:bg-dark-200"
			on:click={() => {
				activeLike = !activeLike
			}}
		>
			<Icon icon={activeLike ? 'twemoji:red-heart' : 'tabler:heart'} size="16" />
			24 Favourites
		</button>
		<button
			class="flex h-10 flex-1 items-center justify-center border-l border-light-100 hover:bg-light-100 dark:border-dark-200 dark:hover:bg-dark-200"
			on:click={() => {
				activeComments = !activeComments
			}}
		>
			<Icon icon="tabler:message" size="16" />
			12 Comments
		</button>
	</div>

	{#if activeComments}
		<div class="mb-5 flex items-start">
			<a href="" class="mr-3">
				<img class="w-10 rounded-full" src="/img/contacts/3.jpg" alt="" />
			</a>
			<div class="flex-1">
				<div class="mb-1 rounded bg-light-100 px-4 py-3 dark:bg-dark-200">
					<a href="" class="mr-1 font-bold text-link hover:underline">Amanda Shier</a>
					Sociis natoque penatibus etemagnis parturient
				</div>

				<!-- <include src="./partials/user/timeline/_comment-actions.html"> { "time": "5 mins" }</include> -->
				<div class="mt-2 flex items-center px-4 text-sm leading-none text-muted">
					<!-- <a href="" class="hover:underline"> <Icon icon="tabler:heart" size="16" /> </a>
				<i class="mx-1 h-0.5 w-0.5 rounded-full bg-current" />
				<a href="" class="hover:underline"> <Icon icon="tabler:message" size="16" /> </a>
				<i class="mx-1 h-0.5 w-0.5 rounded-full bg-current" /> -->

					<div class="ml-auto text-sm text-muted">5 mins</div>
				</div>
			</div>
		</div>

		<div class="mb-5 flex items-start">
			<a href="" class="mr-3">
				<img class="w-10 rounded-full" src="/img/contacts/4.jpg" alt="" />
			</a>
			<div class="flex-1">
				<div class="mb-1 rounded bg-light-100 px-4 py-3 dark:bg-dark-200">
					<a href="" class="mr-1 font-bold text-link hover:underline">Cheslie Temes</a>
					Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus. Aenean
					eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit
					amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor
					ligula, eget lacinia odio sem nec elit. Vestibulum id ligula porta felis euismod semper.
				</div>

				<!-- <include src="./partials/user/timeline/_comment-actions.html"> { "time": "10 mins" }</include> -->
				<div class="mt-2 flex items-center px-4 text-sm leading-none text-muted">
					<div class="ml-auto text-sm text-muted">10 mins</div>
				</div>
			</div>
		</div>

		<div class="mb-5 flex items-start">
			<a href="" class="mr-3">
				<img class="w-10 rounded-full" src="/img/contacts/2.jpg" alt="" />
			</a>
			<div class="flex-1">
				<div class="mb-1 rounded bg-light-100 px-4 py-3 dark:bg-dark-200">
					<a href="" class="mr-1 font-bold text-link hover:underline">Theresa Haney</a>
					Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec
					elit. Maecenas faucibus mollis interdum.
				</div>

				<!-- <include src="./partials/user/timeline/_comment-actions.html"> { "time": "32 mins" }</include> -->
				<div class="mt-2 flex items-center px-4 text-sm leading-none text-muted">
					<div class="ml-auto text-sm text-muted">32 mins</div>
				</div>
			</div>
		</div>

		<div class="mb-5 flex items-start">
			<a href="" class="mr-3">
				<img class="w-10 rounded-full" src="/img/contacts/1.jpg" alt="" />
			</a>
			<div class="flex-1">
				<div class="mb-1 rounded bg-light-100 px-4 py-3 dark:bg-dark-200">
					<a href="" class="mr-1 font-bold text-link hover:underline">Paula Gula</a>
					Bibendum vestibulum malesuada
				</div>

				<!-- <include src="./partials/user/timeline/_comment-actions.html"> { "time": "55 mins" }</include> -->
				<div class="mt-2 flex items-center px-4 text-sm leading-none text-muted">
					<div class="ml-auto text-sm text-muted">40 mins</div>
				</div>
			</div>
		</div>

		<!-- <include src="./partials/user/timeline/_post-reply.html" /> -->
		<div class="flex items-start">
			<a href="" class="mr-3">
				<img class="w-10 rounded-full" src="/images/troc.png" alt="" />
			</a>
			<div class="flex-1">
				<textarea rows="4" class="form-control" placeholder="Write a comment... " />
			</div>
		</div>
	{/if}
</div>
