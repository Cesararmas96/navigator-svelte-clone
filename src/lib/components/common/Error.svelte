<script lang="ts">
	import { errorCodes } from '$lib/helpers/auth/error-codes'
	import Icon from './Icon.svelte'

	export let code
</script>

<div class="flex h-full overflow-y-auto p-5">
	<div class="card m-auto w-full max-w-xl p-8 text-center">
		<Icon icon={errorCodes[code].icon} size="48" />
		<div class="mb-5 mt-3 text-left">
			<h1 class="mb-5 text-center text-2xl">{errorCodes[code].title}</h1>
			<p class="text-lg">
				{@html errorCodes[code].message}
			</p>
		</div>
		<div class="mt-2 flex justify-between text-center text-muted">
			<a href="/" class="block text-md hover:text-body">Go back to home page</a>
			<a href="/logout" class="block text-md hover:text-body">Go back to login page</a>
		</div>
	</div>
</div>

<style>
	p {
		margin: 0.7rem 0;
	}
</style>
