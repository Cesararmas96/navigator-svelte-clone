<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import LoginForm from "$lib/components/forms/LoginForm.svelte";



  let authMethods: Array<string> = [];
  let apiUrl: string;



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
    goto('/error');
  }
</script>

<main>
  <h1>Login</h1>
  {#each authMethods as method}
    <LoginForm
      apiUrl={apiUrl}
      authMethod={method}
      on:success={onLoginSuccess}
      on:fail={onLoginFail}
    />
  {/each}
</main>
