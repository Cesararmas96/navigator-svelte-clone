<script lang="ts">
	import Footer from '$lib/components/layouts/Footer.svelte'
	import Header from '$lib/components/layouts/Header.svelte'
	// import LoadingEnv from '$lib/components/common/LoadingEnv.svelte'

	let width: number
</script>

<svelte:window bind:innerWidth={width} />

<!-- <LoadingEnv /> -->

<Header />

<div class="mx-auto flex w-full">
	<div class="mx-auto w-full">
		<div class="flex h-[calc(100vh-4rem)] flex-col justify-between" data-simplebar>
			<main class="pt-10">
				<slot />
				<!-- <div class="mx-4">
					<Footer />
				</div> -->
			</main>
		</div>
	</div>
</div>
