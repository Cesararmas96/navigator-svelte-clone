<script lang="ts">
    import {Button, Input, Label, Tooltip} from "flowbite-svelte";
    import type {ActionData} from "../$types";
    import {onMount} from "svelte";
    import {enhance} from "$app/forms";
    import {extractSubdomain} from "$lib/helpers/login/login";
    import {getData} from "$lib/services/getData";


    export let form: ActionData;

    let authMethods: Array<any> = [];
    const EXTERNAL_AUTH_METHODS = ["AzureAuth", "ADFSAuth"];
    const apiUrl = import.meta.env.VITE_API_URL;

    const baseUrl = "https://api.trocdigital.io/api/v2/";


    let path = "";
    let alternativePath = "";


    let homeImg = "";
    let favIcon = "";
    let sidebarImg = "";


    // console.log(`${baseUrl}services/images/${}`);


    let link = "";

    let favIconUrl = "";
    let iconUrl = "";
    let logoClientUrl = "";
    let logoHomeUrl = "";
    let sidebarUrl = "";

    let slideshow = [];
    const getLoginData = async () => {
        {

            // TODO 1. Obtain information from company from URL


            const subdomain = extractSubdomain();

            // TODO 2. Use that URL to fetch the company information from the API


            const rawData = await fetch(`${apiUrl}/api/v1/clients?subdomain_prefix=${subdomain}`);
            let data = await rawData.json();
            data = await data[0];
            console.log(data);


            // TODO 3. Get every image image from
            const rootLink = `${baseUrl}services/images/`;

            const {favicon, icon, logo_client, logo_home, sidebar} = data.branding;

            slideshow = data.slideshow; // Array of images
            slideshow = slideshow.map((slide: any) => `${rootLink}${slide}`);

            console.log(slideshow);

            favIconUrl = `${rootLink}${favicon}`;
            iconUrl = `${rootLink}${icon}`;
            logoClientUrl = `${rootLink}${logo_client}`;
            logoHomeUrl = `${rootLink}${logo_home}`;
            sidebarUrl = `${rootLink}${sidebar}`;


            //  TODO 4. Display the company information on the page
            return {
                favIconUrl,
                iconUrl,
                logoClientUrl,
                logoHomeUrl,
                sidebarUrl,
                slideshow
            };





            // TODO 5. Get the auth methods from that company and display them on the page
        }

    };
    onMount(() => {
            getLoginData();

        }
    );


    const importLoginMethods = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/methods`);

            if (!response.ok) throw new Error(`Failed to fetch auth methods: ${response.status}`);

            const authMethodsObject = await response.json();

            authMethods = Object.values(authMethodsObject).filter((authMethod: any) =>
                EXTERNAL_AUTH_METHODS.includes(authMethod.name)
            );
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    onMount(() => {
        importLoginMethods();
    });
</script>


{#await getLoginData() then data}
<!--<img src={data.favIconUrl} alt="Favicon"/>-->

<!--<img src={data.iconUrl} alt="Icon"/>-->

<!--<img src={data.logoClientUrl} alt="Logo Client"/>-->

<!--<img src={data.logoHomeUrl} alt="Logo Home"/>-->

<!--<img src={data.sidebarUrl} alt="Sidebar"/>-->


{#each slideshow as photo}
    <img src={photo} alt="Sidebar" style="max-width: 50px"/>


{/each}

{/await}


<!--<main>-->
<!--    <div class="main-container dark:text-white-dark min-h-screen text-black">-->
<!--        <div class="flex min-h-screen bg-white">-->
<!--            <div-->
<!--                    class="hidden min-h-screen w-4/5 flex-col items-center justify-center bg-gradient-to-t from-[#0066f4bf] to-[#0a3af7] p-4 text-white dark:text-black lg:flex"-->
<!--            >-->
<!--                <div class="mx-auto mb-5 w-full">-->
<!--                    <img src="/img/login/business3.svg" alt="coming_soon" class="mx-auto xl:max-w-[600px]"/>-->
<!--                </div>-->
<!--                &lt;!&ndash; <h3 class="mb-4 text-center text-3xl font-bold">Navigator</h3> &ndash;&gt;-->
<!--                &lt;!&ndash; <p>It is easy to setup with great customer experience. Start your 7-day free trial</p> &ndash;&gt;-->
<!--            </div>-->
<!--            <div class="relative flex w-full items-center justify-center lg:w-2/5">-->
<!--                <div class="w-auto md:p-10">-->
<!--                    <h2 class="mb-3 text-3xl font-bold">Navigator</h2>-->
<!--                    &lt;!&ndash; <h2 class="mb-3 text-3xl font-bold">Sign In</h2> &ndash;&gt;-->
<!--                    &lt;!&ndash; <LoginForm-->
<!--                        {apiUrl}-->
<!--                        authMethod={{-->
<!--                            name: 'BasicAuth',-->
<!--                            uri: '/api/v1/login',-->
<!--                            description: 'Basic User/Password authentication',-->
<!--                            icon: '/static/auth/icons/basic.png',-->
<!--                            external: false,-->
<!--                            headers: {-->
<!--                                'x-auth-method': 'BasicAuth'-->
<!--                            }-->
<!--                        }}-->
<!--                    /> &ndash;&gt;-->

<!--                    <form class="space-y-5" action="?/login" method="POST" use:enhance>-->
<!--                        <p class="mb-7">Enter your email and password to login</p>-->

<!--                        &lt;!&ndash; {#if errors?.status}-->
<!--                                <Alert-->
<!--                                                color="yellow"-->
<!--                                                dismissable-->
<!--                                                transition={fly}-->
<!--                                                params={{ x: 200 }}-->
<!--                                                class="border-l-4"-->
<!--                                                on:click={closeAlertError}-->
<!--                                >-->
<!--                                        <iconify-icon icon="tabler:info-triangle" height="unset" class="mr-1 w-4 h-4"/>-->
<!--                                        {errors?.reason}-->
<!--                                </Alert>-->
<!--                        {/if} &ndash;&gt;-->

<!--                        <div>-->
<!--                            <Label for="email" class="mb-1 !text-gray-900">Email</Label>-->
<!--                            <Input-->
<!--                                    type="text"-->
<!--                                    id="email"-->
<!--                                    defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"-->
<!--                                    name="email"-->
<!--                                    placeholder="email@email.com"-->
<!--                                    required-->
<!--                            />-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <Label for="password" class="mb-1 !text-gray-900">Password</Label>-->
<!--                            <Input-->
<!--                                    type="password"-->
<!--                                    id="password"-->
<!--                                    defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"-->
<!--                                    name="password"-->
<!--                                    placeholder="**********"-->
<!--                                    required-->
<!--                            />-->
<!--                        </div>-->

<!--                        &lt;!&ndash; {#if form?.invalid}-->
<!--                            <p class="error">Username and password is required.</p>-->
<!--                        {/if}-->

<!--                        {#if form?.credentials}-->
<!--                            <p class="error">You have entered the wrong credentials.</p>-->
<!--                        {/if} &ndash;&gt;-->

<!--                        <div class="flex justify-end">-->
<!--                            <a class="text-sm" href="/">Forgot your password?</a>-->
<!--                        </div>-->

<!--                        <Button color="blue" class="w-full" type="submit">SIGN IN</Button>-->
<!--                    </form>-->

<!--                    <div-->
<!--                            class="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]"-->
<!--                    >-->
<!--                        <div class="text-white-dark relative z-[1] inline-block px-2 font-bold">-->
<!--                            <span>OR</span>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    <ul class="grid grid-cols-2 gap-4 sm:gap-5">-->
<!--                        {#each authMethods as method}-->
<!--                            <li>-->
<!--                                <Button-->
<!--                                        href={`${apiUrl}${method.uri}`}-->
<!--                                        outline-->
<!--                                        color={method.color || 'alternative'}-->
<!--                                        class="w-full"-->
<!--                                >-->
<!--                                    <iconify-icon-->
<!--                                            icon={method.icon.split('/').pop() || 'tabler:palette'}-->
<!--                                            height="unset"-->
<!--                                            class="mr-1 h-4 w-4"-->
<!--                                    />{method.name}-->
<!--                                </Button>-->
<!--                                <Tooltip>{method.description}</Tooltip>-->
<!--                            </li>-->
<!--                        {/each}-->
<!--                    </ul>-->
<!--                    &lt;!&ndash; <p class="text-center">-->
<!--                      Dont't have an account ? <a href="auth-cover-register.html" class="font-bold text-primary hover:underline">Sign Up</a>-->
<!--                  </p> &ndash;&gt;-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</main>-->
