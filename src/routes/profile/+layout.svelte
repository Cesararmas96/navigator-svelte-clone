<script>
    import Header from "$lib/components/layouts/Header.svelte";
    import Footer from "$lib/components/layouts/Footer.svelte";
</script>

<Header/>

<div class="mx-auto flex-row w-full">
    <div class="mx-auto w-full">
        <div class="flex h-[calc(100vh-4rem)] flex-col justify-between" data-simplebar>
            <main class="pt-10">
                <slot/>
                <div class="mx-4">
                    <Footer/>
                </div>
            </main>
        </div>
    </div>
</div>
