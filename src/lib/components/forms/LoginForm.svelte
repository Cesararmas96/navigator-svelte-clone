<script lang="ts">
    import {createEventDispatcher, setContext} from "svelte";
    import {Input, Label, Button, Alert} from "flowbite-svelte";
    import {fly} from "svelte/transition";
    import {goto} from "$app/navigation";
    import {isAuthenticated, sessionData} from "$lib/stores";
    import {writable} from "svelte/store";

    export let authMethod: any;
    export let apiUrl: string;
    let username = "";
    let password = "";
    let errors = {
        status: null,
        error: "",
        reason: ""
    };

    // Initialize the session data store and set the context here


    const dispatch = createEventDispatcher();


    async function handleSubmit(e: Event) {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}${authMethod.uri}`, {
                method: "POST",
                headers: {
                    ...authMethod.headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password})
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                sessionStorage.setItem("token", data.token);

                await goto("/home");
            } else {
                const error = await response.json();
                errors = {
                    status: error.status,
                    error: error.error,
                    reason: error.reason
                };
                dispatch("fail");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    function closeAlertError() {
        errors = {
            status: null,
            error: "",
            reason: ""
        };
    }
</script>

<form class="space-y-5" on:submit={handleSubmit}>
    <p class="mb-7">Enter your email and password to login</p>

    {#if errors?.status}
        <Alert
                color="yellow"
                dismissable
                transition={fly}
                params={{ x: 200 }}
                class="border-l-4"
                on:click={closeAlertError}
        >
            <iconify-icon icon="tabler:info-triangle" height="unset" class="mr-1 w-4 h-4"/>
            {errors?.reason}
        </Alert>
    {/if}

    <div>
        <Label for="email" class="mb-1">Email</Label>
        <Input bind:value={username} type="text" id="email" placeholder="email@email.com" required/>
    </div>
    <div>
        <Label for="password" class="mb-1">Password</Label>
        <Input bind:value={password} type="password" id="password" placeholder="**********" required/>
    </div>

    <div class="flex justify-end">
        <a class="text-sm dark:text-gray-400" href="/">Forgot your password?</a>
    </div>

    <Button color="blue" class="w-full" type="submit">SIGN IN</Button>
</form>
