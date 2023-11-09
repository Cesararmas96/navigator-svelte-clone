<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'

	const categories: any[] = [
		{
			id: 1,
			name: 'Manage your Users',
			icon: 'line-md:account',
			icon2: '',
			models: [
				{
					name: 'Users',
					model: 'users'
				},
				{
					name: 'Users Groups',
					model: 'user_groups'
				}
			]
		},
		{
			id: 2,
			name: 'Manage your Groups',
			icon: 'line-md:text-box',
			icon2: '',
			models: [
				{
					name: 'Groups',
					model: 'groups'
				}
			]
		},
		{
			id: 3,
			name: 'Manage your Organizations',
			icon: 'line-md:document-report',
			icon2: '',
			models: [
				{
					name: 'Organizations',
					model: 'organizations'
				},
				{
					name: 'Organizations Groups',
					model: 'groups_organizations'
				}
			]
		},
		{
			id: 4,
			name: 'Manage your Clients',
			icon: 'line-md:clipboard-list',
			icon2: '',
			models: [
				{
					name: 'Clients',
					model: 'organizations'
				},

				{
					name: 'Programs Clients',
					model: 'organizations'
				},
				{
					name: 'Clients Groups',
					model: 'organizations'
				}
			]
		},
		{
			id: 5,
			name: 'Manage your Programs',
			icon: 'line-md:star',
			icon2: '',
			models: [
				{
					name: 'Programs',
					model: 'organizations'
				},
				{
					name: 'Programs Clients',
					model: 'organizations'
				},
				{
					name: 'Programs Groups',
					model: 'organizations'
				}
			]
		},
		{
			id: 6,
			name: 'Manage your Modules',
			icon: 'line-md:square-to-confirm-square-transition',
			icon2: '',
			models: [
				{
					name: 'Modules',
					model: 'organizations'
				},

				{
					name: 'Modules Clients',
					model: 'organizations'
				},
				{
					name: 'Modules Groups',
					model: 'organizations'
				}
			]
		}
	]
	let searchTerm = ''
	let filteredCategories = categories

	function filterCategories() {
		searchTerm = searchTerm.toLowerCase()
		filteredCategories = categories.filter((category) => {
			return category.models.some((model) => {
				return model.name.toLowerCase().includes(searchTerm)
			})
		})
	}

	$: results = filteredCategories.reduce((total, category) => {
		return (
			total +
			category.models.filter((model) => model.name.toLowerCase().includes(searchTerm)).length
		)
	}, 0)
</script>

<div class="mx-auto mb-8 max-w-none p-5 md:max-w-7xl">
	<h2 class="mb-1 text-2xl font-bold text-heading">Navigator Reports</h2>
	<div class="mb-7 text-lg">
		Navigator Reports streamlines the creation of comprehensive web app reporting tools, enabling
		faster development with minimal coding.
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div class="card cursor-pointer p-1 hover:bg-slate-50 dark:hover:bg-gray-700">
			<img
				class="mb-3 w-full rounded-tl rounded-tr"
				src="https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg"
				alt=""
			/>

			<div class="p-5 text-center">
				<h3 class="mb-1 font-bold text-heading">IT &amp; Engineering</h3>
				<div class="mb-5 text-muted">Elit irure laboris tempor veniam velit exercitation</div>

				<div class="text-sm text-muted">View</div>
			</div>
		</div>
		<div class="card p-1">
			<img
				class="mb-3 w-full rounded-tl rounded-tr"
				src="https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg"
				alt=""
			/>

			<div class="p-5 text-center">
				<h3 class="mb-1 font-bold text-heading">UI and Design</h3>
				<div class="mb-5 text-muted">Voluptate laboris fugiat fugiat laboris exercitation</div>

				<div class="text-sm text-muted">View</div>
			</div>
		</div>
		<div class="card p-1">
			<img
				class="mb-3 w-full rounded-tl rounded-tr"
				src="https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
				alt=""
			/>

			<div class="p-5 text-center">
				<h3 class="mb-1 font-bold text-heading">Sales &amp; Marketing</h3>
				<div class="mb-5 text-muted">Cillum ipsumad pariatur proident minim eiusmod</div>

				<div class="text-sm text-muted">View</div>
			</div>
		</div>
	</div>
</div>

<div>
	<h2 class="mb-1 text-2xl font-bold text-heading">Navigator Admin</h2>
	<div class="mb-7 text-lg">
		Navigator Admin makes it easier to build better web apps more quickly and with less code.
	</div>

	<form class="mx-auto max-w-md">
		<input
			type="text"
			class="form-control h-11 rounded-md bg-white/75 text-center text-base placeholder:text-muted dark:bg-dark-100/50"
			placeholder="Type keywords to find model..."
			bind:value={searchTerm}
			on:input={filterCategories}
		/>
	</form>

	{#if !searchTerm}
		<div class="mx-auto max-w-7xl p-5">
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each categories as category}
					<div class="card px-7 py-5">
						<h3 class="mb-3 flex items-center font-bold text-heading">
							<div class="flex-1 text-lg">{category.name}</div>
							<Icon icon={category.icon} size="16px" classes="icon ml-auto text-2xl font-light" />
						</h3>
						<div>
							{#each category.models as model}
								<a
									href="/admin/{model?.model}"
									class="flex items-center border-b border-dashed border-light-200 py-2 hover:text-link dark:border-dark-200 dark:hover:text-heading"
									>{model.name}

									<Icon
										icon="material-symbols:arrow-right-alt"
										size="16px"
										classes="icon ml-auto font-light"
									/>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-7xl p-5">
			<div class="mb-2 px-3 text-muted">A total of {results} results</div>
			<div>
				{#each filteredCategories as category (category.id)}
					{#each category.models as model (model.name)}
						<a
							href="/admin"
							class="mb-1 block rounded-md border border-light-200 bg-white px-4 py-3 hover:border-light-300 hover:bg-light-100/75 dark:border-none dark:bg-dark-100 dark:hover:bg-dark-200"
						>
							<div class="mb-1 truncate font-bold text-heading">{model.name}</div>
							<div class="truncate text-sm text-muted">Last update 2023-10-23</div>
						</a>
					{/each}
				{/each}
			</div>
		</div>
	{/if}
</div>
