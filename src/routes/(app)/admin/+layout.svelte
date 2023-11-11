<script>
	import Header from '$lib/components/layouts/Header.svelte'
	// import { storeUser } from '$lib/stores/session.js'
	// import Footer from '$lib/components/layouts/Footer.svelte'

	// export let data

	// $storeUser = data.user
</script>

<Header />

<div class="mx-auto w-full flex-row">
	<div class="mx-auto w-full">
		<div
			id="admin"
			class="flex h-[calc(100vh-4rem)] w-full flex-col justify-between"
			data-simplebar
		>
			<main>
				<div class="faq-header mb-8 h-52 w-full px-5 py-10 pb-8 text-center">
					<slot />
				</div>
				<!-- <div class="mx-4">
                    <Footer/>
                </div> -->
			</main>
		</div>
	</div>
</div>
