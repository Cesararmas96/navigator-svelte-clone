<script lang="ts">
	import Icon from '$lib/components/common/Icon.svelte'
	export let session: any
</script>

<div class="px-5" style="max-width: 400px">
	<div class="card mx-3 max-w-md text-center" style="min-height: 200px">
		<div>
			<h5 class="text-xl" style="font-size: 50px ;margin-top: 60px">
				{session.first_name[0] + session.last_name[0]}
			</h5>
		</div>
	</div>

	<div class="px-5">
		<div class="mx-3 mt-2 flex items-center font-bold text-heading" style="font-size: 22px">
			{session.first_name}
			{session.last_name}

			<i class="ml-auto h-2 w-2 rounded-full bg-green-500" />
		</div>

		<div class="mx-3 mb-3 text-sm text-muted">{session.username}</div>

		<div class="mx-1 flex py-1.5">
			<Icon icon="ic:outline-email" size="20px" />
			<p class="pl-1.5">{session.email}</p>
		</div>

		<div class="mx-1 flex py-1.5">
			<Icon icon="clarity:group-solid" size="20px" />
			<p class="pl-1.5">
				{session.groups[0].charAt(0).toUpperCase()}{session.groups[0].slice(1)}
			</p>
		</div>

		{#if session.enabled}
			<div class="mx-1 flex py-1.5">
				<Icon icon="fluent:person-available-16-regular" size="20px" />
				<p class="pl-1.5">Enabled</p>
			</div>
		{:else}
			<div class="mx-1 flex py-1.5">
				<Icon icon="mingcute:user-x-fill" size="20px" />
				<p class="pl-1.5">Disabled</p>
			</div>
		{/if}
	</div>
</div>
