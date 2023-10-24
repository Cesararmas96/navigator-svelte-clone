<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'

	const categories = [
		{
			id: 1,
			name: 'Manage your Users',
			icon: 'line-md:account',
			icon2: '',
			models: [
				{
					model: 'Users'
				},
				{
					model: 'Users Groups'
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
					model: 'Groups'
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
					model: 'Organizations'
				},
				{
					model: 'Organizations Groups'
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
					model: 'Clients'
				},

				{
					model: 'Programs Clients'
				},
				{
					model: 'Clients Groups'
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
					model: 'Programs'
				},

				{
					model: 'Programs Clients'
				},
				{
					model: 'Programs Groups'
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
					model: 'Modules'
				},

				{
					model: 'Modules Clients'
				},
				{
					model: 'Modules Groups'
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
				return model.model.toLowerCase().includes(searchTerm)
			})
		})
	}

	$: results = filteredCategories.reduce((total, category) => {
		return (
			total +
			category.models.filter((model) => model.model.toLowerCase().includes(searchTerm)).length
		)
	}, 0)
</script>

<div>
	<div class="faq-header h-52 px-5 py-10 text-center">
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
	</div>

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
									href="/admin"
									class="flex items-center border-b border-dashed border-light-200 py-2 hover:text-link dark:border-dark-200 dark:hover:text-heading"
									>{model.model} <i class="icon ml-auto font-light">east</i>
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
					{#each category.models as model (model.model)}
						<a
							href="/admin"
							class="mb-1 block rounded-md border border-light-200 bg-white px-4 py-3 hover:border-light-300 hover:bg-light-100/75 dark:border-none dark:bg-dark-100 dark:hover:bg-dark-200"
						>
							<div class="mb-1 truncate font-bold text-heading">{model.model}</div>
							<div class="truncate text-sm text-muted">Last update 2023-10-23</div>
						</a>
					{/each}
				{/each}
			</div>
		</div>
	{/if}
</div>
