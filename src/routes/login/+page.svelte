<script lang="ts">
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    import {Button, Tooltip} from "flowbite-svelte";

    import "iconify-icon";
    import LoginForm from "$lib/components/forms/LoginForm.svelte";


    const EXTERNAL_AUTH_METHODS = ["AzureAuth", "ADFSAuth"];


    let authMethods: Array<any> = [];
    let apiUrl = import.meta.env.VITE_API_URL;


    const importLoginMethods = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/methods`);

            if (!response.ok) throw new Error(`Failed to fetch auth methods: ${response.status}`);


            const authMethodsObject = await response.json();

            authMethods = Object.values(authMethodsObject).filter((authMethod) =>
                EXTERNAL_AUTH_METHODS.includes(authMethod.name)
            );
            console.log(authMethods);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    onMount(() => importLoginMethods());

    function onLoginSuccess(token: string) {
        console.log(token);
        sessionStorage.setItem("authToken", token);
        goto("/home");
    }

    function onLoginFail() {
        console.log("Error on login");
    }
</script>


<main>
    <div class="main-container dark:text-white-dark min-h-screen text-black">
        <div class="flex min-h-screen">
            <div
                    class="hidden min-h-screen w-4/5 flex-col items-center justify-center bg-gradient-to-t from-[#0066f4bf] to-[#0a3af7] p-4 text-white dark:text-black lg:flex"
            >
                <div class="mx-auto mb-5 w-full">
                    <img src="/img/login/business3.svg" alt="coming_soon" class="mx-auto xl:max-w-[600px]"/>
                </div>
                <!-- <h3 class="mb-4 text-center text-3xl font-bold">Navigator</h3> -->
                <!-- <p>It is easy to setup with great customer experience. Start your 7-day free trial</p> -->
            </div>
            <div class="relative flex w-full items-center justify-center lg:w-2/5">
                <div class="w-auto md:p-10">
                    <h2 class="mb-3 text-3xl font-bold">Navigator</h2>
                    <!-- <h2 class="mb-3 text-3xl font-bold">Sign In</h2> -->
                    <LoginForm
                            {apiUrl}
                            authMethod={{
							name: 'BasicAuth',
							uri: '/api/v1/login',
							description: 'Basic User/Password authentication',
							icon: '/static/auth/icons/basic.png',
							external: false,
							headers: {
								'x-auth-method': 'BasicAuth'
							}
						}}
                            on:success={onLoginSuccess}
                            on:fail={onLoginFail}
                    />

                    <div
                            class="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]"
                    >
                        <div class="text-white-dark relative z-[1] inline-block px-2 font-bold">
                            <span>OR</span>
                        </div>
                    </div>

                    <ul class="grid grid-cols-2 gap-4 sm:gap-5">
                        {#each authMethods as method}
                            <li>
                                <Button href={`${apiUrl}${method.uri}`} outline color={method.color || 'alternative'}
                                        class="w-full">
                                    <iconify-icon
                                            icon={method.icon.split('/').pop() || 'tabler:palette'}
                                            height="unset"
                                            class="mr-1 h-4 w-4"
                                    />{method.name}
                                </Button>
                                <Tooltip>{method.description}</Tooltip>
                            </li>
                        {/each}
                    </ul>
                    <!-- <p class="text-center">
                      Dont't have an account ? <a href="auth-cover-register.html" class="font-bold text-primary hover:underline">Sign Up</a>
                  </p> -->
                </div>
            </div>
        </div>
    </div>
</main>
