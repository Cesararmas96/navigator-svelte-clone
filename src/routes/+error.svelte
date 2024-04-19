<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="flex h-screen overflow-y-auto p-5">
	<div class="card m-auto w-full max-w-xl p-8 text-center">
		<img class="mb-4 inline-block w-16" src="/img/misc/coming-soon.svg" alt="" />
		<div class="mb-5 text-left">
			<h1 class="mb-5 text-center text-lg">Oops, something went wrong...</h1>
			<p>
				It seems we've encountered an unexpected error on our website. Our team has already been
				notified, and we are working to resolve it.
			</p>
			<p>In the meantime, you can try the following:</p>
			<ul style="list-style-type: disc; margin-left: 20px;">
				<li>Reload the page to see if the issue is resolved.</li>
				<li>Go back to the homepage and explore other parts of our site.</li>
				<li>Contact us if the problem persists or if you need further assistance.</li>
			</ul>
			<p>We apologize for the inconvenience and appreciate your patience.</p>
			{#if $page.error && $page.url.searchParams.get('debug')}
				<div class=" mx-auto mt-4 max-w-2xl">
					<div class="rounded-md bg-gray-900 p-4 text-white">
						<div class="overflow-auto">
							<pre id="code" class="flex text-gray-300">
								<code class="flex flex-col text-white">{@html $page.error.message}</code>
							</pre>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="flex justify-between text-center text-muted">
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
