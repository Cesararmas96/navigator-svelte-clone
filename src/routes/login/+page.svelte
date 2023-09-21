
<script lang="ts">
  import {getContext, onMount} from "svelte";
  import { goto } from '$app/navigation';
  import {Button, Modal} from "flowbite-svelte";
  import BasicAuthForm from '$lib/components/forms/BasicAuthForm.svelte';
  import SSOAuthForm from '$lib/components/forms/SSOAuthForm.svelte';

  let authMethods: Array<string> = [];
  let apiUrl: string;


  let showBasicAuthForm = false
  let showSSOAuthForm = false

  onMount(async () => {
    apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/auth/methods`);
    const authMethodsObject = await response.json();
    authMethods = Object.values(authMethodsObject);
  });

  function onLoginSuccess(token: any) {
    sessionStorage.setItem('authToken', token);
    goto('/home');
  }

  function onLoginFail() {
    console.log('Error');

  }

  console.log(authMethods);

  const handleShowBasicAuthForm = () => {
      showSSOAuthForm = false
      showBasicAuthForm = true
  }


  const handleShowSSOAuthForm = () => {
      showSSOAuthForm = true
      showBasicAuthForm = false
  }



</script>



<h2 style="font-size: 50px; text-align:center">Sign in</h2>



<main>
  {#each authMethods as method}
    {#if method.name === 'BasicAuth' && showBasicAuthForm}
    <BasicAuthForm
      apiUrl={apiUrl}
      authMethod={method}
      on:success={onLoginSuccess}
      on:fail={onLoginFail}
    />
    {/if}

    <!--TODO check SSO -->
    {#if method.name !== 'BasicAuth' && showSSOAuthForm}
    <SSOAuthForm
      apiUrl={apiUrl}
      authMethod={method}
      on:success={onLoginSuccess}
      on:fail={onLoginFail}
    />
    {/if}


  {/each}
</main>



<div class="inline text-center">
<Button class="btn p-10 m-10 " on:click={handleShowSSOAuthForm}>Sign in with SSO</Button>
<Button class="btn p-10 m-10 " on:click={handleShowBasicAuthForm}>Sign in with Basic User/Password authentication</Button>
</div>





