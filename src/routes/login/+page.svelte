<script lang="ts">
    import {Button, Input, Label, P, Tooltip} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {enhance} from "$app/forms";
    import {
        buildImageUrls,
        extractSubdomain,
        fetchCompanyData,
        fetchTotalAuthMethods,
        filterAuthMethods,
        removeBasicAuth,
    } from "$lib/helpers/login/login";
    import ImageGallery from "@react2svelte/image-gallery";

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseProdUrl = "https://api.trocdigital.io/api/v2/";


    const gallerySettings = {
        autoPlay: true,
        slideDuration: 250,
        showBullets: false,
        showThumbnails: true,
        showFullscreenButton: false,
        showPlayButton: false,
        showNav: false,
        infinite: true,
    };


    const getLoginData = async () => {

        try {
            const subdomain = extractSubdomain();
            const rootLink = `${baseProdUrl}services/images/`;
            const data = await fetchCompanyData(subdomain, apiUrl);
            return buildImageUrls(data, rootLink);
        } catch (error) {
            console.error("Failed to fetch company data:", error);
            return null;
        }
    };


    let filteredObject = {};
    const importLoginMethods = async () => {
        const data = await getLoginData();
        const {authMethods} = data;

        try {
            const totalAuthMethods = await fetchTotalAuthMethods(apiUrl);
            filteredObject = filterAuthMethods(totalAuthMethods, authMethods);
            filteredObject = removeBasicAuth(filteredObject);
            console.log(filteredObject);
            return filteredObject;
        } catch (error) {
            console.error("Failed to fetch login methods:", error);
            return null;
        }
    };


    onMount(() => {
        getLoginData();
        importLoginMethods();

    });


</script>

{#await getLoginData() then data}

    <main>
        <div class="main-container dark:text-white-dark min-h-screen text-black">
            <div class="flex min-h-screen bg-white">
                <div
                        class=" w-4/5 flex-col items-center justify-center text-white dark:text-black lg:flex width-full"
                >
                    <!--                    <div class="mx-auto w-full cursor-default" >-->

                    <ImageGallery items={data.slideshowCarouselData} {...gallerySettings}/>
                    <!--                    </div>-->


                </div>
                <div class="relative flex w-full items-center justify-center lg:w-2/5">
                    <div class="w-auto md:p-10">
                        <!--                    <h2 class="mb-3 text-3xl font-bold">Navigator</h2>-->
                        <img src={data.logoClientUrl} alt={data.client}-logo style="min-width: 200px"
                             class="flex ml-auto mr-auto"/>


                        <form class="space-y-5 mt-4" action="?/login" method="POST" use:enhance>
                            <p class="mb-7">Sign in with Basic User/Password authentication</p>


                            <div>
                                <Label for="email" class="mb-1 !text-gray-900">Email</Label>
                                <Input
                                        type="text"
                                        id="email"
                                        defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"
                                        name="email"
                                        placeholder="email@email.com"
                                        required
                                />
                            </div>
                            <div>
                                <Label for="password" class="mb-1 !text-gray-900">Password</Label>
                                <Input
                                        type="password"
                                        id="password"
                                        defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"
                                        name="password"
                                        placeholder="**********"
                                        required
                                />
                            </div>

                            <!-- {#if form?.invalid}
                                <p class="error">Username and password is required.</p>
                            {/if}

                            {#if form?.credentials}
                                <p class="error">You have entered the wrong credentials.</p>
                            {/if} -->

                            <div class="flex justify-end">
                                <a class="text-sm" href="/">Forgot your password?</a>
                            </div>

                            <Button color="blue" class="w-full" type="submit">SIGN IN</Button>
                        </form>

                        <div
                                class="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]"
                        >
                            <div class="text-white-dark relative z-[1] inline-block px-2 font-bold">
                                <span>OR</span>
                            </div>
                        </div>

                        <ul class="grid  gap-4 sm:gap-5 w-full">

                            {#if filteredObject}

                                {#each Object.values(filteredObject) as method}

                                    {#if method.name === 'ADFSAuth'}

                                        <Button
                                                href={`${apiUrl}${method.uri}`}
                                                outline
                                                color={method.color || 'light'}
                                                class="w-full flex mr-auto ml-auto"
                                        >
                                            <P weight="medium">Sign in with SSO</P>
                                        </Button>


                                    {:else}
                                        <li>
                                            <Button
                                                    href={`${apiUrl}${method.uri}`}
                                                    outline
                                                    color={method.color || 'light'}
                                                    class="w-full flex mr-auto ml-auto"

                                            >

                                                <!--TODO Each icon must not be in /static/static. Create a function that splits /static-->
                                                <img src={method.icon} style="max-width: 150px" alt={method.name}/>


                                            </Button>
                                            <Tooltip>{method.description}</Tooltip>
                                        </li>


                                    {/if}


                                {/each}

                            {/if}


                        </ul>


                    </div>
                </div>
            </div>
        </div>
    </main>
{/await}


<style module>

    .my-image-carousel {
        /*width: 100%;*/
        /*height: 100%;*/

        min-width: 10000px;


    }


</style>
