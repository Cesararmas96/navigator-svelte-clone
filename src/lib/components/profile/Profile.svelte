<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	export let session: any
</script>

<div class="card mb-4 ml-4 mt-20 w-80 p-1 md:mt-0">
	<div class="card m-1 max-w-md bg-primary-500 text-center dark:bg-primary-500">
		<h5 class="my-20 text-8xl text-white">
			{session.first_name[0] + session.last_name[0]}
		</h5>
	</div>
	<div class="p-4">
		<div class="flex items-center text-2xl font-bold text-heading">
			{session.first_name}
			{session.last_name} <i class="ml-auto h-2 w-2 rounded-full bg-green-500" />
		</div>
		<div class="mb-3 text-sm text-muted">{session.username}</div>

		<div class="mb-3 flex items-center rounded">
			<Icon icon="clarity:group-solid" size="20px" />
			<p class="pl-1.5">
				{session.groups[0].charAt(0).toUpperCase()}{session.groups[0].slice(1)}
			</p>
		</div>
		<div class="mb-3 flex items-center rounded">
			<Icon icon="ic:outline-email" size="20px" />
			<p class="pl-1.5">{session.email}</p>
		</div>
		<div class="mb-3 flex items-center rounded">
			<Icon icon="clarity:group-solid" size="20px" />
			<p class="pl-1.5">
				{session.groups[0].charAt(0).toUpperCase()}{session.groups[0].slice(1)}
			</p>
		</div>
		<div class="flex items-center rounded">
			{#if session.enabled}
				<Icon icon="fluent:person-available-16-regular" size="20px" />
				<p class="pl-1.5">Enabled</p>
			{:else}
				<Icon icon="mingcute:user-x-fill" size="20px" />
				<p class="pl-1.5">Disabled</p>
			{/if}
		</div>
	</div>
</div>
